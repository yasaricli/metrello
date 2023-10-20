/**
 * The BaseComponent holds the base logic for EasySearch Components.
 *
 * @type {BaseComponent}
 */
BaseComponent = class BaseComponent extends BlazeComponent {
  /**
   * Return the name of the component.
   *
   * @returns {String}
   */
  get name() {
    return this.getData().name;
  }

  /**
   * Return an array of properties that are reserved to the base component.
   *
   * @returns {String[]}
   */
  static get reserveredProperties() {
    return ['index', 'indexes', 'name', 'attributes'];
  }

  /**
   * Setup component on created.
   */
  onCreated() {
    this.autorun(() => this.initializeBase());
  }

  initializeBase() {
    let index = this.getData().index,
      indexes = [index];

    if (!index) {
      indexes = this.getData().indexes;
    }

    if (_.isEmpty(indexes)) {
      throw new Meteor.Error('no-index', 'Please provide an index for your component');
    }

    if (indexes.filter((index) => index instanceof EasySearch.Index).length !== indexes.length) {
      throw new Meteor.Error(
        'invalid-configuration',
        `Did not receive an index or an array of indexes: "${indexes.toString()}"`
      );
    }

    this.indexes = indexes;
    this.options = _.defaults({}, _.omit(this.getData(), ...BaseComponent.reserveredProperties), this.defaultOptions);

    check(this.name, Match.Optional(String));
    check(this.options, Object);

    this.eachIndex(function (index, name) {
      if (!index.getComponentDict(name)) {
        index.registerComponent(name);
      }
    });
  }

  /**
   * Return the default options.
   *
   * @returns {Object}
   */
  get defaultOptions () {
    return {};
  }

  /**
   * @param {String} searchStr
   *
   * @returns {Boolean}
   */
  shouldShowDocuments(searchStr) {
    return !this.getData().noDocumentsOnEmpty || 0 < searchStr.length;
  }

  /**
   * Search the component.
   *
   * @param {String} searchString String to search for
   */
  search(searchString) {
    check(searchString, String);

    const showDocuments = this.shouldShowDocuments(searchString);

    this.eachIndex(function (index, name) {
      index.getComponentDict(name).set('showDocuments', showDocuments);

      if (showDocuments) {
        index.getComponentMethods(name).search(searchString);
      }
    });
  }

  /**
   * Return the data.
   *
   * @returns {Object}
   */
  getData() {
    return (this.data() || {});
  }

  /**
   * Return the dictionaries.
   *
   * @returns {Object}
   */
  get dicts() {
    return this.eachIndex((index, name) => {
      return index.getComponentDict(name);
    }, 'map');
  }

  /**
   * Loop through each index and apply a function
   *
   * @param {Function} func   Function to run
   * @param {String}   method Lodash method name
   *
   * @return mixed
   */
  eachIndex(func, method = 'each') {
    let componentScope = this,
      logic = this.getData().logic;

    if (!_.isEmpty(logic)) {
      method = 'OR' === logic ? 'some' : 'every';
    }

    return _[method](this.indexes, function (index) {
      return func.apply(this, [index, componentScope.name]);
    });
  }
};

EasySearch.BaseComponent = BaseComponent;
