var index = TestHelpers.createIndex();

Tinytest.addAsync('EasySearch - Unit - Core - Index', function (test, done) {
  test.throws(function () {
    new EasySearch.Index();
  });

  test.throws(function () {
    index.search();
  });

  test.throws(function () {
    index.search(true);
  });

  index.config.engine.search = function (searchDefinition, options) {
    test.equal(searchDefinition, 'testSearch');
    test.equal(options.search, { limit: 200, skip: 20, props: {} })
  };

  index.search('testSearch', { limit: 200, skip: 20 });

  index.config.engine.search = function (searchDefinition, options) {
    test.equal(searchDefinition, 'testSearch');
    test.equal(options.search, { props: { custom: 'property' }, limit: 10, skip: 0 })
    done();
  };

  index.search('testSearch', { props: { custom: 'property' } });
});

Tinytest.add('EasySearch - Unit - Core - Index - Error handling', function (test) {
  test.throws(function () {
    index.search('testSearch', { foo: 'bar' });
  });

  test.throws(function () {
    index.search('testSearch', { limit: { foo: 'bar' } });
  });
});

Tinytest.add('EasySearch - Unit - Core - Index - default configuration', function (test) {
  test.equal(EasySearch.Index.defaultConfiguration.permission(), true);
});
