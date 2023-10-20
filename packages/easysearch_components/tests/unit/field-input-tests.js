Tinytest.addAsync('EasySearch Components - Unit - FieldInput', function (test, done) {
  let index = new EasySearch.Index({
    collection: new Mongo.Collection(null),
    engine: new EasySearch.Minimongo(),
    fields: ['test'],
    allowedFields: ['test', 'name', 'score']
  });

  let component = TestHelpers.createComponent(EasySearch.FieldInputComponent, {
    field: 'name',
    indexes: [index]
  });

  let componentTwo = TestHelpers.createComponent(EasySearch.FieldInputComponent, {
    field: 'score',
    indexes: [index]
  });

  component.onCreated();

  test.equal(EasySearch.InputComponent.defaultAttributes, { type: 'text', value: '' });
  test.equal(component.inputAttributes(), { type: 'text', value: '' });
  test.equal(component.options, { timeout: 50, field: 'name', charLimit: 0 });
  test.equal(_.first(component.dicts).get('searchDefinition'), { name: '' });
  test.isFalse(_.first(component.dicts).get('searching'));

  component.debouncedSearch('Peter');
  component.debouncedSearch('Hans');

  test.equal(_.first(component.dicts).get('searchDefinition'), { name: '' });

  componentTwo.onCreated();
  componentTwo.debouncedSearch('200');

  Meteor.setTimeout(function () {
    test.equal(_.first(component.dicts).get('searchDefinition'), { name: 'Hans', score: '200' });
    done();
  }, 300);


  test.throws(function () {
    let component = TestHelpers.createComponent(EasySearch.FieldInputComponent, {
      indexes: [index]
    });

    component.onCreated();
  });
});
