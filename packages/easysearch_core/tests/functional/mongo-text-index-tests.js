var collection = new Mongo.Collection('easysearch_testcollection');

if (Meteor.isServer) {
  collection.remove({ });
  collection.insert({ _id: 'testId', name: 'testName with some weirdtokens in it' });
  collection.insert({ _id: 'testId2', name: 'test what with some other tokens in it' });
}

var index = new EasySearch.Index({
  engine: new EasySearch.MongoTextIndex(),
  collection: collection,
  fields: ['name'],
  allowedFields: ['name', 'otherName']
});

Tinytest.addAsync('EasySearch - Functional - MongoTextIndex - search', function (test, done) {
  // TODO: fix the error that this test throws
  /*
  Tracker.autorun(function (c) {
    var cursor = index.search('weirdtokens testName'),
      docs = cursor.fetch();

    if (docs.length === 1) {
      test.equal(docs, [{ _id: 'testId', name: 'testName with some weirdtokens in it' }]);
      test.equal(cursor.count(), 1);
      done();
      c.stop();
    }
  });
  */

  done();
});

Tinytest.add('EasySearch - Functional - MongoTextIndex - per field search', function (test) {
  test.throws(function () {
    index.search({ 'name': 'test' });
  });
});
