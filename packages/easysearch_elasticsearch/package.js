Package.describe({
  name: 'wekan-easysearch-elasticsearch',
  summary: "Elasticsearch Engine for EasySearch",
  version: "2.2.3",
  git: "https://github.com/matteodem/meteor-easy-search.git",
  documentation: 'README.md'
});

Npm.depends({
  'elasticsearch': '13.0.0'
});

Package.onUse(function(api) {
  // Dependencies
  api.use(['check', 'ecmascript']);
  api.use(['wekan-easysearch-core', 'erasaur:meteor-lodash@4.0.0']);

  api.addFiles([
    'lib/data-syncer.js',
    'lib/engine.js',
  ]);

  api.export('EasySearch');
  api.mainModule('./lib/main.js');
});

Package.onTest(function(api) {
  api.use(['tinytest', 'ecmascript']);
  api.use('wekan-easysearch-elasticsearch');

  api.addFiles(['tests/engine-tests.js']);
});
