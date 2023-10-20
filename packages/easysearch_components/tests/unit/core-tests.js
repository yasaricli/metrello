var collection = new Mongo.Collection(null),
  index = new EasySearch.Index({
  collection: collection,
  engine: new EasySearch.Minimongo(),
  fields: ['test']
});

collection.insert({ 'test': 'foo2' });
collection.insert({ 'test': 'fo2' });
collection.insert({ 'test': '1111 foo' });

index.registerComponent('testName');

Tinytest.add('EasySearch Components - Unit - Core - registerComponent', function (test) {
  index.getComponentDict('testName').set('testValue', 'testBar');
  test.equal(index.getComponentDict('testName').get('testValue'), 'testBar');
});

Tinytest.add('EasySearch Components - Unit - Core - search', function (test) {
  index.getComponentDict('testName').set('searchOptions', { foo: 'bar' });

  index.getComponentMethods('testName').search('');

  test.equal(index.getComponentDict('testName').get('searchDefinition'), '');
  test.equal(index.getComponentDict('testName').get('searchOptions'), {});

  index.getComponentMethods('testName').search('foo');

  test.equal(index.getComponentDict('testName').get('searchDefinition'), 'foo');
  test.equal(index.getComponentDict('testName').get('searchOptions'), {});
});

Tinytest.addAsync('EasySearch Components - Unit - Core - getCursor', function (test, done) {
  Tracker.autorun(function (c) {
    var docs = index.getComponentMethods('testName').getCursor().mongoCursor.fetch();

    if (2 == docs.length) {
      done();
      c.stop();
    }
  });

  index.getComponentMethods('testName').search('foo');
});

Tinytest.add('EasySearch Components - Unit - Core - searchIsEmpty', function (test) {
  index.getComponentMethods('testName').search('');
  test.equal(index.getComponentMethods('testName').searchIsEmpty(), true);
  index.getComponentMethods('testName').search('foo2');
  test.equal(index.getComponentMethods('testName').searchIsEmpty(), false);
});

Tinytest.add('EasySearch Components - Unit - Core - hasNoResults', function (test) {
  index.getComponentDict('testName').set('count', 0);
  test.equal(index.getComponentMethods('testName').hasNoResults(), true);
  index.getComponentDict('testName').set('count', 10);
  test.equal(index.getComponentMethods('testName').hasNoResults(), false);
});

Tinytest.add('EasySearch Components - Unit - Core - isSearching', function (test) {
  index.getComponentDict('testName').set('searching', false);
  test.equal(index.getComponentMethods('testName').isSearching(), false);

  index.getComponentDict('testName').set('searching', true);
  test.equal(index.getComponentMethods('testName').isSearching(), true);
});
