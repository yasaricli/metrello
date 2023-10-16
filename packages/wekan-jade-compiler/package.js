Package.describe({
  summary: "Compiler for the meteor-jade template language",
  version: "0.4.5",
  name: "wekan-jade-compiler",
  git: "https://github.com/mquandalle/meteor-jade.git",
  documentation: "README.md"
});

Package.onUse(function(api) {
  api.use([
    'ecmascript',
    'underscore',
    'htmljs',
    'html-tools',
    'blaze-tools',
    'spacebars-compiler'
  ], ['server']);
  api.use('minifiers', ['server'], { weak: true });
  api.addFiles([
    'lib/lexer.js',
    'lib/parser.js',
    'lib/transpilers.js',
    'lib/exports.js'
  ], ['server']);
  api.export('JadeCompiler');
});

Package.onTest(function (api) {
  api.use("tinytest");
  api.use("minifiers");
  api.use("wekan-jade-compiler", "server");
  api.addFiles(["tests/tests.js"], "server");
});
