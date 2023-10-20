/**
 * The IfInputEmptyComponent lets you display content when the input is empty.
 *
 * @type {IfInputEmptyComponent}
 */
EasySearch.IfInputEmptyComponent = class IfInputEmptyComponent extends BaseComponent {
  /**
   * Return true if the input is empty.
   *
   * @returns {boolean}
   */
  inputEmpty() {
    return !!this.eachIndex(function (index, name) {
      return index.getComponentMethods(name).searchIsEmpty();
    }, 'every');
  }
};

EasySearch.IfInputEmptyComponent.register('EasySearch.IfInputEmpty');
