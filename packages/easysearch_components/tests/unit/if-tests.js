Tinytest.add('EasySearch Components - Unit - IfInputEmpty', function (test) {
  var component = TestHelpers.createComponent(EasySearch.IfInputEmptyComponent, {
    index: new EasySearch.Index({
      collection: new Mongo.Collection(null),
      engine: new EasySearch.Minimongo(),
      fields: ['test']
    })
  });

  component.onCreated();

  _.first(component.dicts).set('searchDefinition', null);
  test.isTrue(component.inputEmpty());

  _.first(component.dicts).set('searchDefinition', '');
  test.isTrue(component.inputEmpty());

  _.first(component.dicts).set('searchDefinition', '   ');
  test.isTrue(component.inputEmpty());

  _.first(component.dicts).set('searchDefinition', 'test');
  test.isFalse(component.inputEmpty());
});

Tinytest.add('EasySearch Components - Unit - IfNoResults', function (test) {
  var component = TestHelpers.createComponent(EasySearch.IfNoResultsComponent, {
    index: new EasySearch.Index({
      collection: new Mongo.Collection(null),
      engine: new EasySearch.Minimongo(),
      fields: ['test']
    })
  });

  component.onCreated();

  _.first(component.dicts).set('count', null);
  test.isTrue(component.noResults());

  _.first(component.dicts).set('count', 0);
  test.isTrue(component.noResults());

  _.first(component.dicts).set('count', 1);
  test.isFalse(component.noResults());

  _.first(component.dicts).set('count', 120);
  test.isFalse(component.noResults());
});

Tinytest.add('EasySearch Components - Unit - IfSearching', function (test) {
  var component = TestHelpers.createComponent(EasySearch.IfSearchingComponent, {
    index: new EasySearch.Index({
      collection: new Mongo.Collection(null),
      engine: new EasySearch.Minimongo(),
      fields: ['test']
    })
  });

  component.onCreated();

  _.first(component.dicts).set('searching', true);
  test.isTrue(component.searching());

  _.first(component.dicts).set('searching', false);
  test.isFalse(component.searching());
});
