import { Mongo } from 'meteor/mongo'
import Engine from './engine'

/**
 * An Index represents the main entry point for searching with EasySearch. It relies on
 * the given engine to have the search functionality and defines the data that should be searchable.
 *
 * @type {Index}
 */
class Index {
  /**
   * Constructor
   *
   * @param {Object} config Configuration
   *
   * @constructor
   */
  constructor(config) {
    check(config, Object);
    check(config.fields, [String]);
    if(!config.ignoreCollectionCheck) check(config.collection, Mongo.Collection);

    if (!(config.engine instanceof Engine)) {
      throw new Meteor.Error('invalid-engine', 'engine needs to be instanceof Engine');
    }

    if (!config.name)
      config.name = (config.collection._name || '').toLowerCase();

    this.config = _.extend(Index.defaultConfiguration, config);
    this.defaultSearchOptions = _.defaults(
      {},
      this.config.defaultSearchOptions,
      { limit: 10, skip: 0, props: {} },
    );

    // Engine specific code on index creation
    config.engine.onIndexCreate(this.config);
  }

  /**
   * Default configuration for an index.
   *
   * @returns {Object}
   */
  static get defaultConfiguration() {
    return {
      permission: () => true,
      defaultSearchOptions: {},
      countUpdateIntervalMs: 2000,
    };
  }

  /**
   * Search the index.
   *
   * @param {Object|String} searchDefinition Search definition
   * @param {Object}        options          Options
   *
   * @returns {Cursor}
   */
  search(searchDefinition, options = {}) {
    this.config.engine.checkSearchParam(searchDefinition, this.config);

    check(options, {
      limit: Match.Optional(Number),
      skip: Match.Optional(Number),
      props: Match.Optional(Object),
      userId: Match.Optional(Match.OneOf(String, null)),
    });

    options = {
      search: this._getSearchOptions(options),
      index: this.config,
    };

    if (!this.config.permission(options.search)) {
      throw new Meteor.Error('not-allowed', "Not allowed to search this index!");
    }

    return this.config.engine.search(searchDefinition, options);
  }

  /**
   * Returns the search options based on the given options.
   *
   * @param {Object} options Options to use
   *
   * @returns {Object}
   */
  _getSearchOptions(options) {
    if (!Meteor.isServer) {
      delete options.userId;
    }

    if (typeof options.userId === "undefined" && Meteor.userId) {
      options.userId = Meteor.userId();
    }

    return _.defaults(options, this.defaultSearchOptions);
  }
}

export default Index;
