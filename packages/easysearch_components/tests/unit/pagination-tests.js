Tinytest.add('EasySearch Components - Unit - Pagination - _getPagesForPagination', function (test) {
  var pages = EasySearch._getPagesForPagination({ totalCount: 39, pageCount: 10, currentPage: 1 });

  test.equal(pages[0], { page: 1, content: "1", current: true, disabled: true });
  test.equal(pages[1], { page: 2, content: "2", current: false, disabled: false });
  test.equal(pages[2], { page: 3, content: "3", current: false, disabled: false });
  test.equal(pages[3], { page: 4, content: "4", current: false, disabled: false });
  test.isUndefined(pages[4]);

  test.throws(function () {
    EasySearch._getPagesForPagination({ totalCount: 39, pageCount: 10, currentPage: 0 });
  });

  test.throws(function () {
    EasySearch._getPagesForPagination({ totalCount: 39, pageCount: 10, currentPage: 5 });
  });

  pages = EasySearch._getPagesForPagination({ totalCount: 39, pageCount: 10, currentPage: 4, prevAndNext: true });

  test.equal(pages[0], { page: 3, content: "Prev", current: false, disabled: false });
  test.equal(pages[1], { page: 1, content: "1", current: false, disabled: false });
  test.equal(pages[2], { page: 2, content: "2", current: false, disabled: false });
  test.equal(pages[3], { page: 3, content: "3", current: false, disabled: false });
  test.equal(pages[4], { page: 4, content: "4", current: true, disabled: true });
  test.equal(pages[5], { page: null, content: "Next", current: false, disabled: true });
  test.isUndefined(pages[6]);

  pages = EasySearch._getPagesForPagination({ totalCount: 50, pageCount: 5, currentPage: 1, prevAndNext: true, maxPages: 3 });

  test.equal(pages[0], { page: null, content: "Prev", current: false, disabled: true });
  test.equal(pages[1], { page: 1, content: "1", current: true, disabled: true });
  test.equal(pages[2], { page: 2, content: "2", current: false, disabled: false });
  test.equal(pages[3], { page: 3, content: "3", current: false, disabled: false });
  test.equal(pages[4], { page: 2, content: "Next", current: false, disabled: false });

  pages = EasySearch._getPagesForPagination({ totalCount: 50, pageCount: 5, currentPage: 6, prevAndNext: true, maxPages: 3 });

  test.equal(pages[0], { page: 5, content: "Prev", current: false, disabled: false });
  test.equal(pages[1], { page: 5, content: "5", current: false, disabled: false });
  test.equal(pages[2], { page: 6, content: "6", current: true, disabled: true });
  test.equal(pages[3], { page: 7, content: "7", current: false, disabled: false });
  test.equal(pages[4], { page: 7, content: "Next", current: false, disabled: false });

  pages = EasySearch._getPagesForPagination({ totalCount: 50, pageCount: 5, currentPage: 9, prevAndNext: true, maxPages: 5 });

  test.equal(pages[0], { page: 8, content: "Prev", current: false, disabled: false });
  test.equal(pages[1], { page: 6, content: "6", current: false, disabled: false });
  test.equal(pages[2], { page: 7, content: "7", current: false, disabled: false });
  test.equal(pages[3], { page: 8, content: "8", current: false, disabled: false });
  test.equal(pages[4], { page: 9, content: "9", current: true, disabled: true });
  test.equal(pages[5], { page: 10, content: "10", current: false, disabled: false });
  test.equal(pages[6], { page: 10, content: "Next", current: false, disabled: false });

  pages = EasySearch._getPagesForPagination({ totalCount: 200, pageCount: 10, currentPage: 8, prevAndNext: true, maxPages: 10 });

  test.equal(pages[0], { page: 7, content: "Prev", current: false, disabled: false });
  test.equal(pages[1], { page: 3, content: "3", current: false, disabled: false });
  test.equal(pages[2], { page: 4, content: "4", current: false, disabled: false });
  test.equal(pages[3], { page: 5, content: "5", current: false, disabled: false });
  test.equal(pages[4], { page: 6, content: "6", current: false, disabled: false });
  test.equal(pages[5], { page: 7, content: "7", current: false, disabled: false });
  test.equal(pages[6], { page: 8, content: "8", current: true, disabled: true });
  test.equal(pages[7], { page: 9, content: "9", current: false, disabled: false });
  test.equal(pages[8], { page: 10, content: "10", current: false, disabled: false });
  test.equal(pages[9], { page: 11, content: "11", current: false, disabled: false });
  test.equal(pages[10], { page: 12, content: "12", current: false, disabled: false });
  test.equal(pages[11], { page: 9, content: "Next", current: false, disabled: false });

  pages = EasySearch._getPagesForPagination({ totalCount: 200, pageCount: 10, currentPage: 11, prevAndNext: true, maxPages: 10 });

  test.equal(pages[0], { page: 10, content: "Prev", current: false, disabled: false });
  test.equal(pages[1], { page: 6, content: "6", current: false, disabled: false });
  test.equal(pages[2], { page: 7, content: "7", current: false, disabled: false });
  test.equal(pages[3], { page: 8, content: "8", current: false, disabled: false });
  test.equal(pages[4], { page: 9, content: "9", current: false, disabled: false });
  test.equal(pages[5], { page: 10, content: "10", current: false, disabled: false });
  test.equal(pages[6], { page: 11, content: "11", current: true, disabled: true });
  test.equal(pages[7], { page: 12, content: "12", current: false, disabled: false });
  test.equal(pages[8], { page: 13, content: "13", current: false, disabled: false });
  test.equal(pages[9], { page: 14, content: "14", current: false, disabled: false });
  test.equal(pages[10], { page: 15, content: "15", current: false, disabled: false });
  test.equal(pages[11], { page: 12, content: "Next", current: false, disabled: false });
});

Tinytest.add('EasySearch Components - Unit - Pagination', function (test) {
  var component = TestHelpers.createComponent(EasySearch.PaginationComponent, {
    index: new EasySearch.Index({
      collection: new Mongo.Collection(null),
      engine: new EasySearch.Minimongo(),
      fields: ['test']
    })
  });

  component.onCreated();

  test.isNull(component.options.maxPages);
  test.isTrue(component.options.prevAndNext);
  test.equal(component.options.transformPages([1, 2, 3]), [1, 2, 3]);

  test.equal(component.pageClasses({ disabled: true }), 'disabled');
  test.equal(component.pageClasses({ current: true }), 'current');
});

