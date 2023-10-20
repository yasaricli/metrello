var collection = new Mongo.Collection(null);

if (Meteor.isServer) {
  collection.insert({ _id: 'testId', name: 'testName' });
  collection.insert({ _id: 'beforePublishDoc', sortField: -1, name: 'publishdoc' });

  for (var i = 0; i < 100; i += 1) {
    collection.insert({ _id: 'testId' + i, sortField: i, name: 'name sup what', otherName: (i == 1 ? 'what' : '') });
  }
}

var index = new EasySearch.Index({
  engine: new EasySearch.MongoDB({
    sort: function () {
      return ['sortField'];
    },
    selectorPerField: function (field, searchString, options) {
      if ('testName' === searchString) {
        var selector = {};

        selector[field] = 'name sup what';

        if (options.search.props.returnNone) {
          selector[field] = '';
        }

        return selector;
      }

      return this.defaultConfiguration().selectorPerField(field, searchString);
    },
    beforePublish: function (event, doc) {
      if ('addedAt' == event && 'beforePublishDoc' == doc._id) {
        doc.newAwesomeProperty = doc.name + ' awesome property';
      }

      return doc;
    }
  }),
  collection: collection,
  fields: ['name'],
  allowedFields: ['name', 'otherName']
});

var customDocObjectIndex = new EasySearch.Index({
  name: 'secondIndex',
  engine: new EasySearch.MongoDB({
    transform(doc) {
      return new (function (data) {
        this.getData = function () {
          return data;
        };
      })(doc);
    }
  }),
  collection: collection,
  fields: ['name']
});

function getExpectedDocs(count) {
  var docs = [];

  for (var i = 0; i < count; i += 1) {
    docs.push({ _id: 'testId' + i,  sortField: i, name: 'name sup what', otherName: (i == 1 ? 'what' : '') });
  }

  return docs;
}

Tinytest.addAsync('EasySearch - Functional - MongoDB - prefix search', function (test, done) {
  Tracker.autorun(function (c) {
    var docs = index.search('test').fetch();

    if (docs.length === 1) {
      test.equal(docs[0].name, 'testName');
      test.equal(index.search('test').count(), 1);
      done();
      c.stop();
    }
  });
});

Tinytest.addAsync('EasySearch - Functional - MongoDB - suffixed search', function (test, done) {
  Tracker.autorun(function (c) {
    var cursor = index.search('what'),
      docs = cursor.fetch();

    if (docs.length === 10) {
      test.equal(cursor.count(), 100);
      test.equal(docs[0].name, 'name sup what');
      test.equal(docs[0].sortField, 0);
      test.equal(docs[5].name, 'name sup what');
      test.equal(docs[6].sortField, 6);
      test.equal(index.search('what').count(), 100);
      done();
      c.stop();
    }
  });
});

Tinytest.addAsync('EasySearch - Functional - MongoDB - custom selector', function (test, done) {
  Tracker.autorun(function (c) {
    var cursor = index.search('testName', { limit: 20 }),
      docs = cursor.fetch();

    if (docs.length === 20) {
      test.equal(cursor.count(), 100);
      test.equal(docs[11].sortField, 11);
      test.equal(docs[17].sortField, 17);

      test.equal(index.search('testName').count(), 100);
      done();
      c.stop();
    }
  });
});

Tinytest.addAsync('EasySearch - Functional - MongoDB - custom property', function (test, done) {
  Tracker.autorun(function (c) {
    var cursor = index.search('should not match anything', { limit: 10, props: { returnNone: true } }),
      docs = cursor.fetch();

    if (docs.length === 0) {
      test.equal(cursor.count(), 0);
      done();
      c.stop();
    }
  });
});

Tinytest.addAsync('EasySearch - Functional - MongoDB - per field search', function (test, done) {
  Tracker.autorun(function (c) {
    var cursor = index.search({ otherName: 'what' }, { limit: 20 }),
      docs = cursor.fetch();

    if (cursor.count() === 1) {
      test.equal(docs[0].sortField, 1);
      test.equal(docs[0].name, 'name sup what');
      test.equal(docs[0].otherName, 'what');
      done();
      c.stop();
    }
  });
});

Tinytest.addAsync('EasySearch - Functional - MongoDB - beforePublish', function (test, done) {
  Tracker.autorun(function (c) {
    var docs = index.search('publish').fetch();

    if (docs.length === 1) {
      var expectedDocs = [{ _id: 'beforePublishDoc', sortField: -1, name: 'publishdoc' }];

      Meteor.setTimeout(function () {
        test.equal(docs[0].sortField, -1);
        test.equal(docs[0].name, 'publishdoc');

        if (Meteor.isClient) {
          test.equal(docs[0].newAwesomeProperty, 'publishdoc awesome property');
        }

        test.equal(index.search('publish').count(), 1);
        done();
        c.stop();
      }, 100);
    }
  });
});

Tinytest.add('EasySearch - Functional - MongoDB - failing searches', function (test) {
  test.throws(function () {
    index.search(100);
  });

  test.throws(function () {
    index.search({ score: 10 });
  });
});

if (Meteor.isClient) {
  Tinytest.addAsync('EasySearch - Functional - MongoDB - Transform custom object instances', function (test, done) {
    Tracker.autorun(function (c) {
      var docs = customDocObjectIndex.search('publish').fetch();

      if (docs.length === 1) {
        var expectedDoc = { _id: 'beforePublishDoc', sortField: -1, name: 'publishdoc' },
          firstActualDoc = docs[0];

        test.isTrue("function" == typeof firstActualDoc.getData);
        test.equal(firstActualDoc.getData().sortField, -1);
        test.equal(firstActualDoc.getData().name, 'publishdoc');

        done();
        c.stop();
      }
    });
  });
}
