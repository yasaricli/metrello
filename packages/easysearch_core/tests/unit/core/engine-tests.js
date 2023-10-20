Tinytest.add('EasySearch - Unit - Core - Engine', function (test) {
  var CustomNoSearchEngine = TestHelpers.createEngine({}),
    CustomSearchEngine = TestHelpers.createEngine({
      search: function () {
        var cursor = new Mongo.Cursor();

        cursor.fetch = function () { return []; };

        return new EasySearch.Cursor(cursor, 200);
      }
    });

  test.throws(function () {
    new EasySearch.Engine();
  });

  test.throws(function () {
    new CustomNoSearchEngine();
  });

  var engineInstance = new CustomSearchEngine();

  test.equal(engineInstance.search().fetch(), []);
  test.equal(engineInstance.search().count(), 200);
});


Tinytest.add('EasySearch - Unit - Core - Engine - custom configuration', function (test) {
  var CustomSearchEngine = TestHelpers.createEngine({
      search: function () {
        var cursor = new Mongo.Cursor();

        cursor.fetch = function () { return []; };

        return new EasySearch.Cursor(cursor, 200);
      }
    }, { otherMethod: function () {
      return 'otherString';
    }});

  var nonOverwritingEngineInstance = new CustomSearchEngine({
    customMethod: function () {
      return 'someString';
    }
  });

  var overwritingEngineInstance = new CustomSearchEngine({
    otherMethod: function () {
      return 'anotherString';
    }
  });

  test.equal(nonOverwritingEngineInstance.config.customMethod(), 'someString');
  test.equal(nonOverwritingEngineInstance.config.otherMethod(), 'otherString');
  test.isUndefined(overwritingEngineInstance.config.customMethod);
  test.equal(overwritingEngineInstance.config.otherMethod(), 'anotherString');
});
