Package.describe({
  name: 'wekan-autofocus',
  version: '1.0.0',
  summary: 'Support autofocus attribute in Blaze templates',
  git: 'https://github.com/mquandalle/blaze-autofocus',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.use('blaze');
  api.use('templating');
  api.use('underscore');
  api.addFiles('autofocus.js', 'client');
  api.export('AutofocusableTags', 'client', { testOnly: true });
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('underscore');
  api.use('wekan-autofocus');
  api.addFiles('autofocus-tests.html', 'client');
  api.addFiles('autofocus-tests.js', 'client');
});
