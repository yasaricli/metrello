Tinytest.addAsync('EasySearch Components - Unit - Input', function (test, done) {
  var component = TestHelpers.createComponent(EasySearch.InputComponent, {
    attributes: { type: 'number' },
    indexes: [new EasySearch.Index({
      collection: new Mongo.Collection(null),
      engine: new EasySearch.Minimongo(),
      fields: ['test']
    })]
  });

  component.onCreated();

  test.equal(EasySearch.InputComponent.defaultAttributes, { type: 'text', value: '' });
  test.equal(component.inputAttributes(), { type: 'number', value: '' });
  test.equal(component.options, { timeout: 50, charLimit: 0 });
  test.equal(_.first(component.dicts).get('searchDefinition'), '');
  test.isFalse(_.first(component.dicts).get('searching'));

  component.debouncedSearch('Peter');
  component.debouncedSearch('Hans');

  test.equal(_.first(component.dicts).get('searchDefinition'), '');

  Meteor.setTimeout(function () {
    test.equal(_.first(component.dicts).get('searchDefinition'), 'Hans');
    done();
  }, 100);
});
