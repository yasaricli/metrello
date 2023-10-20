Package.describe({
  name: 'wekan-easysearch-autosuggest',
  summary: "Selectize Autosuggest Component for EasySearch",
  version: "2.2.3",
  git: "https://github.com/matteodem/meteor-easy-search.git",
  documentation: 'README.md'
});

Package.onUse(function(api) {
  // Dependencies
  api.use(['check', 'ecmascript', 'templating', 'blaze']);
  api.use([
    'wekan-easysearch-core',
    'wekan-easysearch-components',
    'jeremy:selectize@0.12.1_4',
  ]);

  api.use(['erasaur:meteor-lodash@4.0.0']);

  api.addFiles([
    'lib/autosuggest.html',
  ], 'client');

  api.mainModule('lib/autosuggest.js', 'client');
});

Package.onTest(function(api) {
  api.use(['tinytest', 'ecmascript', 'templating']);
  api.use('wekan-easysearch-autosuggest');

  api.addFiles(['tests/autosuggest-tests.js'], 'client');
});
