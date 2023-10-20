import ReactiveEngine from '../core/reactive-engine';
import MongoDBEngine from './mongo-db';

/**
 * The MongoTextIndexEngine lets you search the index with Mongo text indexes.
 *
 * @type {MongoTextIndexEngine}
 */
class MongoTextIndexEngine extends ReactiveEngine {
  /**
   * Return default configuration.
   *
   * @returns {Object}
   */
  defaultConfiguration() {
    let mongoConfiguration = MongoDBEngine.defaultMongoConfiguration(this);

    mongoConfiguration.selector = function (searchString) {
      if (searchString.trim()) {
        return { $text: { $search: searchString } };
      }

      return {};
    };

    return _.defaults({}, mongoConfiguration, super.defaultConfiguration());
  }

  /**
   * Setup the index on creation.
   *
   * @param {Object} indexConfig Index configuration
   */
  onIndexCreate(indexConfig) {
    super.onIndexCreate(indexConfig);

    if (Meteor.isServer) {
      let textIndexesConfig = {};

      _.each(indexConfig.fields, function (field) {
        textIndexesConfig[field] = 'text';
      });

      if (indexConfig.weights) {
        textIndexesConfig.weights = options.weights();
      }

      indexConfig.collection._ensureIndex(textIndexesConfig);
    }
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
    return searchDefinition;
  }

  /**
   * Check the given search parameter for validity
   *
   * @param search
   */
  checkSearchParam(search) {
    check(search, String);
  }
}

// Explicitely inherit getSearchCursor method functionality
MongoTextIndexEngine.prototype.getSearchCursor = MongoDBEngine.prototype.getSearchCursor;
MongoTextIndexEngine.prototype.getFindOptions = MongoDBEngine.prototype.getFindOptions;

export default MongoTextIndexEngine;
