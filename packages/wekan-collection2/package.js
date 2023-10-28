/* global Package, Npm */

Package.describe({
  name: 'wekan-collection2',
  summary: 'Automatic validation of Meteor Mongo insert and update operations on the client and server',
  version: '3.6.0',
  documentation: 'README.md',
  git: 'https://github.com/wekan/wekan-collection2.git'
})

Npm.depends({
  'lodash.isempty': '4.4.0',
  'lodash.isequal': '4.5.0',
  'lodash.isobject': '3.0.2'
})

Package.onUse(function (api) {
  api.versionsFrom(['1.12.1', '2.3', '3.0-alpha.17']);
  api.use('mongo');
  api.imply('mongo');
  api.use('minimongo');
  api.use('ejson');
  api.use('raix:eventemitter');
  api.use('ecmascript');
  api.use('tmeasday:check-npm-versions');

  // Allow us to detect 'insecure'.
  api.use('insecure', { weak: true });

  api.mainModule('collection2.js');

  api.export('Collection2');
})
