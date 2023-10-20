import Engine from '../core/engine';
import ReactiveEngine from '../core/reactive-engine';
import MongoDBEngine from './mongo-db';

/**
 * The MinimongEngine lets you search the index on the client-side.
 *
 * @type {MinimongoEngine}
 */
class MinimongoEngine extends Engine {
  /**
   * Return default configuration.
   *
   * @returns {Object}
   */
  defaultConfiguration() {
    return _.defaults({}, MongoDBEngine.defaultMongoConfiguration(this), super.defaultConfiguration());
  }

  /**
   * Search the index.
   *
   * @param {Object} searchDefinition Search definition
   * @param {Object} options          Object of options
   *
   * @returns {cursor}
   */
  search(searchDefinition, options) {
    if (!Meteor.isClient) {
      throw new Meteor.Error('only-client', 'Minimongo can only be used on the client');
    }

    searchDefinition = this.transformSearchDefinition(searchDefinition, options);

    // check() calls are in getSearchCursor method
    return MongoDBEngine.prototype.getSearchCursor.apply(this, [searchDefinition, options]);
  }
}

MinimongoEngine.prototype.checkSearchParam = ReactiveEngine.prototype.checkSearchParam;
MinimongoEngine.prototype.transformSearchDefinition = ReactiveEngine.prototype.transformSearchDefinition;

MinimongoEngine.prototype.getFindOptions = function (...args) {
  let findOptions = MongoDBEngine.prototype.getFindOptions.apply(this, args);

  findOptions.transform = this.config.transform;

  return findOptions;
};

export default MinimongoEngine;
