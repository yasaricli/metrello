import { Mongo } from 'meteor/mongo'
import Cursor from './cursor'
import ReactiveEngine from './reactive-engine'

/**
 * A search collection represents a reactive collection on the client,
 * which is used by the ReactiveEngine for searching.
 *
 * @type {SearchCollection}
 */
class SearchCollection {
  /**
   * Constructor
   *
   * @param {Object}         indexConfiguration Index configuration
   * @param {ReactiveEngine} engine             Reactive Engine
   *
   * @constructor
   */
  constructor(indexConfiguration, engine) {
    check(indexConfiguration, Object);
    check(indexConfiguration.name, Match.OneOf(String, null));

    if (!(engine instanceof ReactiveEngine)) {
      throw new Meteor.Error('invalid-engine', 'engine needs to be instanceof ReactiveEngine');
    }

    this._indexConfiguration = indexConfiguration;
    this._name = `${indexConfiguration.name}/easySearch`;
    this._engine = engine;

    if (Meteor.isClient) {
      this._collection = new Mongo.Collection(this._name);
    } else if (Meteor.isServer) {
      this._setUpPublication();
    }
  }

  /**
   * Get name
   *
   * @returns {String}
   */
  get name() {
    return this._name;
  }

  /**
   * Get engine
   *
   * @returns {ReactiveEngine}
   */
  get engine() {
    return this._engine;
  }

  /**
   * Find documents on the client.
   *
   * @param {Object} searchDefinition Search definition
   * @param {Object} options          Options
   *
   * @returns {Cursor}
   */
  find(searchDefinition, options) {
    if (!Meteor.isClient) {
      throw new Error('find can only be used on client');
    }

    let publishHandle = Meteor.subscribe(this.name, searchDefinition, options);

    let count = this._getCount(searchDefinition);
    let mongoCursor = this._getMongoCursor(searchDefinition, options);

    if (!_.isNumber(count)) {
      return new Cursor(mongoCursor, 0, false);
    }

    return new Cursor(mongoCursor, count, true, publishHandle);
  }

  /**
   * Get the count of the cursor.
   *
   * @params {Object} searchDefinition Search definition
   *
   * @returns {Cursor.count}
   *
   * @private
   */
  _getCount(searchDefinition) {
    let countDoc = this._collection.findOne('searchCount' + JSON.stringify(searchDefinition));

    if (countDoc) {
      return countDoc.count;
    }
  }

  /**
   * Get the mongo cursor on the client.
   *
   * @param {Object} searchDefinition Search definition
   * @param {Object} options          Search options
   *
   * @returns {Cursor}
   * @private
   */
  _getMongoCursor(searchDefinition, options) {
    const clientSort = this.engine.callConfigMethod('clientSort', searchDefinition, options);

    return this._collection.find(
      { __searchDefinition: JSON.stringify(searchDefinition), __searchOptions: JSON.stringify(options.props) },
      {
        transform: (doc) => {
          delete doc.__searchDefinition;
          delete doc.__searchOptions;
          delete doc.__sortPosition;

          doc = this.engine.config.transform(doc);

          return doc;
        },
        sort: (clientSort ? clientSort : ['__sortPosition'])
      }
    );
  }

  /**
   * Return a unique document id for publication.
   *
   * @param {Document} doc
   *
   * @returns string
   */
  generateId(doc) {
    return doc._id + doc.__searchDefinition + doc.__searchOptions;
  }

  /**
   * Add custom fields to the given document
   *
   * @param {Document} doc
   * @param {Object}   data
   * @returns {*}
   */
  addCustomFields(doc, data) {
    _.forEach(data, function (val, key) {
      doc['__' + key] = val;
    });

    return doc;
  }

  /**
   * Set up publication.
   *
   * @private
   */
  _setUpPublication() {
    var collectionScope = this,
      collectionName = this.name;

    Meteor.publish(collectionName, function (searchDefinition, options) {
      check(searchDefinition, Match.OneOf(String, Object));
      check(options, Object);

      let definitionString = JSON.stringify(searchDefinition),
        optionsString = JSON.stringify(options.props);

      options.userId = this.userId;
      options.publicationScope = this;

      if (!collectionScope._indexConfiguration.permission(options)) {
        throw new Meteor.Error('not-allowed', "You're not allowed to search this index!");
      }

      collectionScope.engine.checkSearchParam(searchDefinition, collectionScope._indexConfiguration);

      let cursor = collectionScope.engine.search(searchDefinition, {
        search: options,
        index: collectionScope._indexConfiguration
      });

      const count = cursor.count();

      this.added(collectionName, 'searchCount' + definitionString, { count });

      let intervalID;

      if (collectionScope._indexConfiguration.countUpdateIntervalMs) {
        intervalID = Meteor.setInterval(
          () => this.changed(
            collectionName,
            'searchCount' + definitionString,
            { count: cursor.mongoCursor.count && cursor.mongoCursor.count() || 0 }
          ),
          collectionScope._indexConfiguration.countUpdateIntervalMs
        );
      }

      let resultsHandle;
      this.onStop(function () {
        intervalID && Meteor.clearInterval(intervalID);
        resultsHandle && resultsHandle.stop();
      });

      let observedDocs = [];

      const updateDocWithCustomFields = (doc, sortPosition) => collectionScope
        .addCustomFields(doc, {
          originalId: doc._id,
          sortPosition,
          searchDefinition: definitionString,
          searchOptions: optionsString,
        });

      
      resultsHandle = cursor.mongoCursor.observe({
        addedAt: (doc, atIndex, before) => {
          doc = collectionScope.engine.config.beforePublish('addedAt', doc, atIndex, before);
          doc = updateDocWithCustomFields(doc, atIndex);

          this.added(collectionName, collectionScope.generateId(doc), doc);

          /*
           * Reorder all observed docs to keep valid sorting. Here we adjust the
           * sortPosition number field to give space for the newly added doc
           */
          if (observedDocs.map(d => d.__sortPosition).includes(atIndex)) {
            observedDocs = observedDocs.map((doc, docIndex) => {
              if (doc.__sortPosition >= atIndex) {
                doc = collectionScope.addCustomFields(doc, {
                  sortPosition: doc.__sortPosition + 1,
                });

                // do not throw changed event on last doc as it will be removed from cursor
                if (docIndex < observedDocs.length) {
                  this.changed(
                    collectionName,
                    collectionScope.generateId(doc),
                    doc
                  );
                }
              }

              return doc;
            });
          }

          observedDocs = [...observedDocs , doc];
        },
        changedAt: (doc, oldDoc, atIndex) => {
          doc = collectionScope.engine.config.beforePublish('changedAt', doc, oldDoc, atIndex);
          doc = collectionScope.addCustomFields(doc, {
            searchDefinition: definitionString,
            searchOptions: optionsString,
            sortPosition: atIndex,
            originalId: doc._id
          });

          this.changed(collectionName, collectionScope.generateId(doc), doc);
        },
        movedTo: (doc, fromIndex, toIndex, before) => {
          doc = collectionScope.engine.config.beforePublish('movedTo', doc, fromIndex, toIndex, before);
          doc = updateDocWithCustomFields(doc, toIndex);

          let beforeDoc = collectionScope._indexConfiguration.collection.findOne(before);

          if (beforeDoc) {
            beforeDoc = collectionScope.addCustomFields(beforeDoc, {
              searchDefinition: definitionString,
              searchOptions: optionsString,
              sortPosition: fromIndex
            });
            this.changed(collectionName, collectionScope.generateId(beforeDoc), beforeDoc);
          }

          this.changed(collectionName, collectionScope.generateId(doc), doc);
        },
        removedAt: (doc, atIndex) => {
          doc = collectionScope.engine.config.beforePublish('removedAt', doc, atIndex);
          doc = collectionScope.addCustomFields(
            doc,
            {
              searchDefinition: definitionString,
              searchOptions: optionsString
            });
          this.removed(collectionName, collectionScope.generateId(doc));

          /*
           * Adjust sort position for all docs after the removed doc and
           * remove the doc from the observed docs array
           */
          observedDocs = observedDocs.map(doc => {
            if (doc.__sortPosition > atIndex) {
              doc.__sortPosition -= 1;
            }

            return doc;
          }).filter(
            d => collectionScope.generateId(d) !== collectionScope.generateId(doc)
          );
        }
      });

      this.onStop(function () {
        resultsHandle.stop();
      });

      this.ready();
    });
  }
}

export default SearchCollection;
