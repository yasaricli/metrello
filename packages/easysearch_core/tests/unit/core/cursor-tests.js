Tinytest.add('EasySearch - Unit - Core - Cursor', function (test) {
  test.throws(function () {
    new EasySearch.Cursor();
  });

  test.throws(function () {
    new EasySearch.Cursor(new Mongo.Cursor(), null);
  });

  var mongoCursor = new Mongo.Cursor(),
    cursor = new EasySearch.Cursor(mongoCursor, 200),
    notReadyCursor = new EasySearch.Cursor(mongoCursor, 0, false);

  mongoCursor.fetch = function () {
    return [{ _id: 'testId', name: 'whatever' }, { _id: 'testId2', name: 'whatever2' }];
  };

  test.equal(cursor.fetch(), [{ _id: 'testId', name: 'whatever' }, { _id: 'testId2', name: 'whatever2' }]);
  test.equal(cursor.count(), 200);
  test.equal(cursor.mongoCursor, mongoCursor);
  test.equal(cursor.isReady(), true);
  test.equal(notReadyCursor.isReady(), false);
});
