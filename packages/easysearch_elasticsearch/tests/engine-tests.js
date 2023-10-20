Tinytest.add('EasySearch ElasticSearch - Unit - Configuration', function (test) {
  var defaultConfig = EasySearch.ElasticSearch.defaultElasticsearchConfiguration(),
    doc = {
      name: 'test name',
      score: 12,
      nested: { field: '200' }
    };

  test.equal(defaultConfig.fieldsToIndex(), null);
  test.equal(defaultConfig.query({ name: 'testString' }, { index: { fields: ['name'] } }), {
    bool: {
      should: [{ fuzzy_like_this: {
        'fields': ['name'],
        'like_text': 'testString'
      }}]
    }
  });

  test.equal(defaultConfig.sort('testString', { index: { fields: ['name'] } }), ['name']);

  test.equal(defaultConfig.getElasticSearchDoc(doc, null), doc);
  test.equal(defaultConfig.getElasticSearchDoc(doc, ['score', 'nested.field']),{ score: 12, 'nested.field' : '200' });

  test.equal(defaultConfig.client, { host: 'localhost:9200' });
});
