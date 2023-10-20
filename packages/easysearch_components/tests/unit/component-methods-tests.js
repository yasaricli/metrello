Tinytest.add('EasySearch Components - Unit - Component Methods - addProps / removeProps', function (test) {
  let index = new EasySearch.Index({
    collection: new Mongo.Collection('setPropsCollection'),
    engine: new EasySearch.Minimongo(),
    fields: ['test']
  });

  index.registerComponent();

  let componentMethods = index.getComponentMethods();

  componentMethods.addProps('customProp', 'customValue');

  console.log(index.getComponentDict().get('searchOptions'));
  test.equal(index.getComponentDict().get('searchOptions'), {
    props: {
      customProp: 'customValue'
    },
    skip: NaN,
  });

  componentMethods.addProps({
    what: 'test',
    aha: 'yeah'
  });

  test.equal(index.getComponentDict().get('searchOptions'), {
    props: {
      what: 'test',
      aha: 'yeah',
      customProp: 'customValue'
    },
    skip: NaN,
  });

  componentMethods.addProps({
    aha: 'yeah new',
    anArray: ['i', 'am', 'complex']
  });

  test.equal(index.getComponentDict().get('searchOptions').props.aha, 'yeah new');
  test.equal(index.getComponentDict().get('searchOptions').props.anArray, ['i', 'am', 'complex']);

  componentMethods.removeProps('aha', 'customProp', 'anArray');

  test.equal(index.getComponentDict().get('searchOptions'), {
    props: {
      what: 'test'
    },
    skip: NaN,
  });

  componentMethods.removeProps();

  test.equal(index.getComponentDict().get('searchOptions'), {
    props: {},
    skip: NaN,
  });
});
