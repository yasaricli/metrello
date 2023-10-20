

Tinytest.add('EasySearch Components - Unit - Base', function (test) {
  var component = TestHelpers.createComponent(EasySearch.BaseComponent, {
    name: 'customName',
    index: new EasySearch.Index({
      collection: new Mongo.Collection('baseIndexCollection'),
      engine: new EasySearch.Minimongo(),
      fields: ['test']
    }),
    fooTest: 'barTest'
  });

  component.onCreated();
  component.search('testString');

  test.throws(function () {
    component.search({ tryto: 'hack' });
  });

  test.equal(component.name, 'customName');
  test.equal(component.options, { fooTest: 'barTest' });
  test.equal(component.defaultOptions, {});
  test.instanceOf(_.first(component.indexes), EasySearch.Index);
  test.equal(_.first(component.dicts).get('searchDefinition'), 'testString');
});

Tinytest.add('EasySearch Components - Unit - Base without index', function (test) {
  var component = TestHelpers.createComponent(EasySearch.BaseComponent, {
    attributes: { type: 'number' },
    name: 'customName',
    fooTest: 'barTest'
  });

  test.throws(function () {
    component.onCreated();
  });
});
