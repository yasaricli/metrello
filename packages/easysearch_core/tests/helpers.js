TestHelpers = {
  createEngine: function (methods, defaultConf = {}) {
    let e = class engine extends EasySearch.Engine {
      defaultConfiguration() { return defaultConf; }
    };

    _.each(methods, function (method, key) {
      e.prototype[key] = method;
    });

    return e;
  },
  createReactiveEngine: function (methods, defaultConf = {}) {
    let e = class engine extends EasySearch.ReactiveEngine {
      defaultConfiguration() { return defaultConf; }
    };

    _.each(methods, function (method, key) {
      e.prototype[key] = method;
    });

    return e;
  },
  createIndex: function () {
    return new EasySearch.Index({
      collection: new Mongo.Collection(null),
      fields: ['testField'],
      engine: new (TestHelpers.createEngine({ search: function () {} }))()
    });
  }
};
