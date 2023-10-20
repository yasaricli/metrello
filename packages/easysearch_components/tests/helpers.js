TestHelpers = {
  createComponent: function(component, data) {
    var c = new component();

    c.data = function () { return data; };
    c.autorun = (f) => f();

    return c;
  }
};
