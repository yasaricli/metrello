Package.describe({
  name: "wekan-schema-deny",
  summary: "Deny inserting or updating certain properties through schema options",
  version: "3.0.0",
  documentation: 'README.md',
  git: "https://github.com/wekan/wekan-schema-deny.git"
});

Package.onUse(function(api) {
  api.use([
    'wekan-collection2',
    'ecmascript',
  ]);

  api.mainModule('deny.js');
});
