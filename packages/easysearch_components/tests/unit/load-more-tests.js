Tinytest.add('EasySearch Components - Unit - LoadMore', function (test) {
  var component = TestHelpers.createComponent(EasySearch.LoadMoreComponent, {
    count: 15,
    attributes: { 'class': 'whatsup' },
    indexes: [new EasySearch.Index({
      collection: new Mongo.Collection(null),
      engine: new EasySearch.Minimongo(),
      fields: ['test']
    })]
  });

  component.onCreated();

  test.equal(component.options, {
    content: 'Load more',
    count: 15
  });

  test.equal(component.defaultOptions, {
    content: 'Load more',
    count: 10
  });

  test.equal(component.attributes(), { 'class': 'whatsup' });
  test.equal(component.content(), 'Load more');

  component.dict.set('currentCount', 20);
  component.dict.set('count', 30);

  test.equal(component.moreDocuments(), true);

  component.dict.set('currentCount', 20);
  component.dict.set('count', 19);

  test.equal(component.moreDocuments(), false);

  component.loadMore();
  test.equal(component.dict.get('searchOptions').limit, 35);
});
