/**
 * The LoadMoreComponent lets you load more documents through a button.
 *
 * @type {LoadMoreComponent}
 */
EasySearch.LoadMoreComponent = class LoadMoreComponent extends SingleIndexComponent {
  /**
   * Load more documents.
   */
  loadMore() {
    this.index
      .getComponentMethods(this.name)
      .loadMore(this.options.count)
    ;
  }

  /**
   * Content of the component.
   *
   * @returns string
   */
  content() {
    return this.options.content;
  }

  /**
   * Attributes of the component.
   *
   * @returns string
   */
  attributes() {
    return this.getData().attributes || {};
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
      'click button' : function () {
        this.loadMore();
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
      content: 'Load more',
      count: 10
    };
  }
};

EasySearch.LoadMoreComponent.register('EasySearch.LoadMore');
