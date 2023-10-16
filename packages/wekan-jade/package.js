Package.describe({
  summary: "Jade template language",
  version: "0.4.9",
  name: "wekan-jade",
  git: "https://github.com/mquandalle/meteor-jade.git",
  documentation: "README.md",
});

Package.registerBuildPlugin({
  name: "compileJadeBatch",
  use: [
    "ecmascript",
    "caching-html-compiler",
    "underscore",
    "htmljs",
    "minifiers",
    "spacebars-compiler",
    "templating-tools",
    "wekan-jade-compiler",
  ],
  sources: [
    "plugin/handler.js",
  ]
});

Package.onUse(function (api) {
  api.use("isobuild:compiler-plugin");
  api.use("blaze");
});

Package.onTest(function (api) {
  api.use("tinytest");
  api.use([
    "wekan-jade",
    "jquery",
    "spacebars",
    "templating",
    "ui",
    "underscore",
  ]);
  api.addFiles([
    "tests/match.jade",
    "tests/match.html",
    "tests/runtime.jade",
    "tests/body.tpl.jade",
    "tests/img_tag_here.tpl.jade",
  ]);
  api.addFiles(["tests/match.js", "tests/runtime.js"], "client");
});
