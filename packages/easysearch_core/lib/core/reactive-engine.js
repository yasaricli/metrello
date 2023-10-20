import SearchCollection from './search-collection'
import Engine from './engine'

/**
 * A ReactiveEngine handles the reactive logic, such as subscribing
 * and publishing documents into a self contained collection.
 *
 * @type {ReactiveEngine}
 */
class ReactiveEngine extends Engine {
  /**
   * Constructor.
   *
   * @param {Object} config Configuration
   *
   * @constructor
   */
  constructor(config) {
    super(config);

    if (this === this.constructor) {
      throw new Error('Cannot initialize instance of ReactiveEngine');
    }

    if (!_.isFunction(this.getSearchCursor)) {
      throw new Error('Reactive engine needs to implement getSearchCursor method');
    }
  }

  /**
   * Return default configuration.
   *
   * @returns {Object}
   */
  defaultConfiguration() {
    return _.defaults({}, {
      transform: (doc) => doc,
      beforePublish: (event, doc) => doc
    }, super.defaultConfiguration());
  }

  /**
   * Code to run on index creation
   *
   * @param {Object} indexConfig Index configuration
   */
  onIndexCreate(indexConfig) {
    super.onIndexCreate(indexConfig);
    indexConfig.searchCollection = new SearchCollection(indexConfig, this);
    indexConfig.mongoCollection = indexConfig.searchCollection._collection;
  }

  /**
   * Transform the search definition.
   *
   * @param {String|Object} searchDefinition Search definition
   * @param {Object}        options          Search and index options
   *
   * @returns {Object}
   */
  transformSearchDefinition(searchDefinition, options) {
    if (_.isString(searchDefinition)) {
      let obj = {};

      _.each(options.index.fields, function (field) {
        obj[field] = searchDefinition;
      });

      searchDefinition = obj;
    }

    return searchDefinition;
  }

  /**
   * Check the given search parameter for validity
   *
   * @param search
   * @param indexOptions
   */
  checkSearchParam(search, indexOptions) {
    check(search, Match.OneOf(String, Object));

    if (_.isObject(search)) {
      _.each(search, function (val, field) {
        check(val, String);

        if (-1 === _.indexOf(indexOptions.allowedFields, field)) {
          throw new Meteor.Error(`Not allowed to search over field "${field}"`);
        }
      });
    }
  }

  /**
   * Reactively search on the collection.
   *
   * @param {Object} searchDefinition Search definition
   * @param {Object} options          Options
   *
   * @returns {Cursor}
   */
  search(searchDefinition, options) {
    if (Meteor.isClient) {
      return options.index.searchCollection.find(searchDefinition, options.search);
    } else {
      return this.getSearchCursor(
        this.transformSearchDefinition(searchDefinition, options),
        options
      );
    }
  }
}

export default ReactiveEngine;
