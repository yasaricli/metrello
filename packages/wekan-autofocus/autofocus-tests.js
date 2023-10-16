Tinytest.add('Autofocus - exported tags', function (test) {
  test.equal(AutofocusableTags.length, 3);
});

_.forEach(AutofocusableTags, function (htmlTag) {
  Tinytest.addAsync('Autofocus - ' + htmlTag, function (test, next) {
    var view = Blaze.render(Blaze.Template('autofocus-' + htmlTag, function () {
      return HTML[htmlTag.toUpperCase()]({ autofocus: '' });
    }), document.body);

    Meteor.defer(function () {
      test.equal(document.activeElement, view.firstNode());
      Blaze.remove(view);
      next();
    });
  });
});
