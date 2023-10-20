import Cursor from '../core/cursor';
import ReactiveEngine from '../core/reactive-engine';

/**
 * The MongoDBEngine lets you search the index on the server side with MongoDB. Subscriptions and publications
 * are handled within the Engine.
 *
 * @type {MongoDBEngine}
 */
class MongoDBEngine extends ReactiveEngine {
  /**
   * Return default configuration.
   *
   * @returns {Object}
   */
  defaultConfiguration() {
    return _.defaults({}, MongoDBEngine.defaultMongoConfiguration(this), super.defaultConfiguration());
  }

  /**
   * Default mongo configuration, used in constructor and MinimongoEngine to get the configuration.
   *
   * @param {Object} engineScope Scope of the engine
   *
   * @returns {Object}
   */
  static defaultMongoConfiguration(engineScope) {
    return {
      aggregation: '$or',
      selector(searchObject, options, aggregation) {
        const selector = {};

        selector[aggregation] = [];

        _.each(searchObject, (searchString, field) => {
          const fieldSelector = engineScope.callConfigMethod(
            'selectorPerField', field, searchString, options
          );

          if (fieldSelector) {
            selector[aggregation].push(fieldSelector);
          }
        });

        return selector;
      },
      selectorPerField(field, searchString) {
        const selector = {};

        searchString = searchString.replace(/(\W{1})/g, '\\$1');
        selector[field] = { '$regex' : `.*${searchString}.*`, '$options' : 'i'};

        return selector;
      },
      sort(searchObject, options) {
        return options.index.fields;
      }
    };
  }

  /**
   * Return the find options for the mongo find query.
   *
   * @param {String} searchDefinition Search definition
   * @param {Object} options          Search and index options
   */
  getFindOptions(searchDefinition, options) {
    return {
      skip: options.search.skip,
      limit: options.search.limit,
      disableOplog: this.config.disableOplog,
      pollingIntervalMs: this.config.pollingIntervalMs,
      pollingThrottleMs: this.config.pollingThrottleMs,
      sort: this.callConfigMethod('sort', searchDefinition, options),
      fields: this.callConfigMethod('fields', searchDefinition, options)
    };
  }

  /**
   * Return the reactive search cursor.
   *
   * @param {String} searchDefinition Search definition
   * @param {Object} options          Search and index options
   */
  getSearchCursor(searchDefinition, options) {
    const selector = this.callConfigMethod(
        'selector',
        searchDefinition,
        options,
        this.config.aggregation
      ),
      findOptions = this.getFindOptions(searchDefinition, options),
      collection = options.index.collection;

    check(options, Object);
    check(selector, Object);
    check(findOptions, Object);

    return new Cursor(
      collection.find(selector, findOptions),
      collection.find(selector).count()
    );
  }
}

export default MongoDBEngine;
