/**
 * An Engine is the technology used for searching with EasySearch, with
 * customizable configuration to how it interacts with the data from the Index.
 *
 * @type {Engine}
 */
class Engine {
  /**
   * Constructor
   *
   * @param {Object} config configuration
   *
   * @constructor
   */
  constructor(config = {}) {
    if (this.constructor === Engine) {
      throw new Error('Cannot initialize instance of Engine');
    }

    if (!_.isFunction(this.search)) {
      throw new Error('Engine needs to implement search method');
    }

    this.config = _.defaults({}, config, this.defaultConfiguration());
  }

  /**
   * Return default configuration.
   *
   * @returns {Object}
   */
  defaultConfiguration() {
    return {};
  }

  /**
   * Call a configuration method with the engine scope.
   *
   * @param {String} methodName Method name
   * @param {Object} args       Arguments for the method
   *
   * @returns {*}
   */
  callConfigMethod(methodName, ...args) {
    check(methodName, String);

    let func = this.config[methodName];

    if (func) {
      return func.apply(this, args);
    }
  }

  /**
   * Check the given search parameter for validity
   *
   * @param search
   */
  checkSearchParam(search) {
    check(search, String);
  }

  /**
   *Code to run on index creation
   *
   * @param {Object} indexConfig Index configuraction
   */
  onIndexCreate(indexConfig) {
    if (!indexConfig.allowedFields) {
      indexConfig.allowedFields = indexConfig.fields;
    }
  }
}

export default Engine;
