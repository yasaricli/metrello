Package.describe({
  name: 'wekan-easy-search',
  summary: "Easy-to-use search with Blaze Components (+ Elastic Search Support)",
  version: "2.2.3",
  git: "https://github.com/matteodem/meteor-easy-search.git",
  documentation: "README.md"
});

Package.onUse(function(api) {
  api.use([
    'ecmascript',
    'wekan-easysearch-core',
    'wekan-easysearch-components',
  ]);

  api.export('EasySearch');

  api.mainModule('./main.js');
});
