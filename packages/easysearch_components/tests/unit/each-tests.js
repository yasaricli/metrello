Tinytest.add('EasySearch Components - Unit - Each', function (test) {
  var component = TestHelpers.createComponent(EasySearch.EachComponent, {
    index: new EasySearch.Index({
      collection: new Mongo.Collection(null),
      engine: new EasySearch.Minimongo(),
      fields: ['test']
    })
  });

  component.onCreated();

  _.first(component.indexes).search = function (searchDefinition) {
    test.equal(searchDefinition, 'hans');
    return new EasySearch.Cursor({
      fetch: function () { return [{ foo: 'bar' }]; },
      count: function () { return 10; }
    }, 200);
  };

  component.dict.set('searchDefinition', 'hans');
  component.dict.set('searchOptions', {});

  var cursor = component.doc();

  test.equal(component.dict.get('count'), 200);
  test.equal(component.dict.get('currentCount'), 10);
  test.equal(component.dict.get('searching'), false);
  test.equal(cursor.fetch(), [{ foo: 'bar' }]);

  test.throws(function () {
    TestHelpers.createComponent(EasySearch.EachComponent, {
      indexes: [new EasySearch.Index({
        collection: new Mongo.Collection(null),
        engine: new EasySearch.Minimongo(),
        fields: ['test']
      })]
    });
  }());
});
