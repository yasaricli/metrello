/**
 * The PaginationComponent lets you paginate through documents.
 *
 * @type {PaginationComponent}
 */
EasySearch.PaginationComponent = class PaginationComponent extends SingleIndexComponent {
  /**
   * Setup component on created.
   */
  onCreated() {
    super.onCreated();
    this.index.getComponentMethods(this.name).paginate(1);
  }

  /**
   * Get pages for displaying the pagination.
   *
   * @returns {Array}
   */
  page() {
    let totalCount = this.dict.get('count'),
      pageCount = this.dict.get('limit'),
      currentPage = this.dict.get('currentPage'),
      maxPages = this.options.maxPages,
      prevAndNext = this.options.prevAndNext;

    if (!pageCount || !totalCount) {
      return [];
    }

    return this.options.transformPages(
      EasySearch._getPagesForPagination(
        {
          totalCount,
          pageCount,
          currentPage,
          maxPages,
          prevAndNext
        }
    ));
  }

  customRenderPagination() {
    return this.getData().customRenderPagination;
  }

  /**
   * Paginate documents.
   */
  paginate(page) {
    check(page, Number);

    this.index.getComponentMethods(this.name).paginate(page);
  }

  /**
   * Return page classes.
   *
   * @param {Object} data Data for the current page
   *
   * @returns {String}
   */
  pageClasses(data) {
    return `${(data.disabled ? 'disabled' : '' )} ${(data.current ? 'current' : '' )}`.trim();
  }

  /**
   * Return true if there are more documents to load.
   *
   * @returns {Boolean}
   */
  moreDocuments() {
    return this.index.getComponentMethods(this.name).hasMoreDocuments();
  }

  /**
   * Event map.
   *
   * @returns {Object}
   */
  events() {
    return [{
      'click .page:not(.disabled)' : function (e) {
        let currentPage = this.currentData().page;
        this.dict.set('currentPage', currentPage);
        this.paginate(currentPage);

        e.preventDefault();
      }
    }];
  }

  /**
   * Return the default options.
   *
   * @returns {Object}
   */
  get defaultOptions() {
    return {
      prevAndNext: true,
      maxPages: null,
      transformPages: (pages) => pages
    };
  }
};

EasySearch.PaginationComponent.register('EasySearch.Pagination');
