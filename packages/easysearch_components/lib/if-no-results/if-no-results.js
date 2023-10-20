/**
 * The IfNoResultsComponent lets you display content when there are no results.
 *
 * @type {IfNoResultsComponent}
 */
EasySearch.IfNoResultsComponent = class IfNoResultsComponent extends BaseComponent {
  /**
   * Return true if there are no results.
   *
   * @returns {boolean}
   */
  noResults() {
    return !!this.eachIndex(function (index, name) {
      return index.getComponentMethods(name).hasNoResults();
    }, 'every');
  }
};

EasySearch.IfNoResultsComponent.register('EasySearch.IfNoResults');
