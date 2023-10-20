Package.describe({
  name: 'wekan-easysearch-core',
  summary: "Javascript Core for EasySearch",
  version: "2.2.3",
  git: "https://github.com/matteodem/meteor-easy-search.git",
  documentation: 'README.md'
});

Package.onUse(function(api) {
  // Dependencies
  api.use(['check', 'ecmascript', 'mongo', 'underscore']);
  api.use(['erasaur:meteor-lodash'], { weak: true });

  // Core packages
  api.addFiles([
    'lib/core/index.js',
    'lib/core/engine.js',
    'lib/core/reactive-engine.js',
    'lib/core/cursor.js',
    'lib/core/search-collection.js'
  ]);

  // Engines
  api.addFiles([
    'lib/engines/mongo-db.js',
    'lib/engines/minimongo.js',
    'lib/engines/mongo-text-index.js'
  ]);

  // Global
  api.addFiles(['lib/globals.js']);
  api.export('EasySearch');

  api.mainModule('lib/main.js');
});

Package.onTest(function(api) {
  api.use(['tinytest', 'mongo', 'tracker', 'ecmascript', 'audit-argument-checks', 'underscore']);
  api.use('wekan-easysearch-core');

  // Test Helpers
  api.addFiles(['tests/helpers.js']);

  // Unit tests
  api.addFiles([
    'tests/unit/core/cursor-tests.js',
    'tests/unit/core/engine-tests.js',
    'tests/unit/core/reactive-engine-tests.js',
    'tests/unit/core/index-tests.js'
  ]);

  // Functional tests
  api.addFiles([
    'tests/functional/mongo-db-tests.js',
    'tests/functional/mongo-text-index-tests.js',
    'tests/functional/minimongo-tests.js'
  ]);
});
