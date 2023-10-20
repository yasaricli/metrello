/**
 * The SingleIndexComponent holds logic for components that only can use one index.
 *
 * @type {SingleIndexComponent}
 */
SingleIndexComponent = class SingleIndexComponent extends BaseComponent {
  /**
   * Setup component on created.
   */
  onCreated() {
    super.onCreated();

    if (this.indexes.length > 1) {
      throw new Meteor.Error('only-single-index', 'Can only specify one index');
    }
  }

  /**
   * Return the index
   *
   * @returns {Index}
   */
  get index() {
    return _.first(this.indexes);
  }

  /**
   * Return the dictionary.
   *
   * @returns {Object}
   */
  get dict() {
    return _.first(this.dicts);
  }
};

EasySearch.SingleIndexComponent = SingleIndexComponent;
