/**
 * Extend EasySearch.Index with component functionality.
 *
 * @type {Index}
 */
EasySearch.Index = class Index extends EasySearch.Index {
  /**
   * Constructor.
   */
  constructor() {
    super(...arguments);
    this.components = {};
  }

  /**
   * Return static default name for components.
   *
   * @returns {String}
   */
  static get COMPONENT_DEFAULT_NAME() {
    return'__default';
  }

  /**
   * Register a component on the index.
   *
   * @param {String} componentName Optional name of the component
   */
  registerComponent(componentName = EasySearch.Index.COMPONENT_DEFAULT_NAME) {
    this.components[componentName] = new ReactiveDict(
      `easySearchComponent_${this.config.name}_${componentName}_${Random.id()}`
    );
  }

  /**
   * Get the reactive dictionary for a component.
   *
   * @param {String} componentName Optional name of the component
   */
  getComponentDict(componentName = EasySearch.Index.COMPONENT_DEFAULT_NAME) {
    return this.components[componentName];
  }

  /**
   * Get component methods that are useful for implementing search behaviour.
   *
   * @param componentName
   */
  getComponentMethods(componentName = EasySearch.Index.COMPONENT_DEFAULT_NAME) {
    let dict = this.getComponentDict(componentName);

    if (!dict) {
      throw new Meteor.Error('no-component', `Component with name '${componentName}' not found`);
    }

    return EasySearch._getComponentMethods(dict, this);
  }
};

/**
 * Return true if the current page is valid.
 *
 * @param {Number} totalPagesLength Count of all pages available
 * @param {Number} currentPage      Current page to check
 *
 * @returns {boolean}
 */
function isValidPage(totalPagesLength, currentPage) {
  return currentPage <= totalPagesLength && currentPage > 0;
}

/**
 * Helper method to get the pages for pagination as an array.
 *
 * @param totalCount   Total count of results
 * @param pageCount    Count of results per page
 * @param currentPage  Current page
 * @param prevAndNext  True if Next and Previous buttons should appear
 * @param maxPages     Maximum count of pages to show
 *
 * @private
 *
 * @returns {Array}
 */
EasySearch._getPagesForPagination = function ({totalCount, pageCount, currentPage, prevAndNext, maxPages}) {
  let pages = _.range(1, Math.ceil(totalCount / pageCount) + 1),
    pagesLength = pages.length;

  if (!isValidPage(pagesLength, currentPage)) {
    throw new Meteor.Error('invalid-page', 'Current page is not in valid range');
  }

  if (maxPages) {
    let startSlice = (currentPage > (maxPages / 2) ? (currentPage - 1) - Math.floor(maxPages / 2) : 0),
      endSlice = startSlice + maxPages;

    if (endSlice > pagesLength) {
      pages = pages.slice(-maxPages);
    } else {
      pages = pages.slice(startSlice, startSlice + maxPages);
    }
  }

  let pageData = _.map(pages, function (page) {
    let isCurrentPage = page === currentPage;
    return { page, content: page.toString(), current: isCurrentPage, disabled: isCurrentPage };
  });

  if (prevAndNext) {
    // Previous
    let prevPage = isValidPage(pagesLength, currentPage - 1) ? currentPage - 1 : null;
    pageData.unshift({ page: prevPage, content: 'Prev', current: false, disabled: 1 === currentPage });
    // Next
    let nextPage = isValidPage(pagesLength, currentPage + 1) ? currentPage + 1 : null;
    pageData.push(
      { page: nextPage, content: 'Next', current: false, disabled: null == nextPage || pagesLength + 1 === currentPage }
    );
  }

  return pageData;
};
