AutofocusableTags = ['input', 'textarea', 'button'];

var autofocusSelector = _.map(AutofocusableTags, function (tag) {
  return tag + '[autofocus]';
}).join(', ');

var autofocusRenderedCallback = function() {
  var autofocusField = this.find(autofocusSelector);
  if (autofocusField) {
    autofocusField.focus();
  }
}

var _super = Template.prototype._getCallbacks;
Template.prototype._getCallbacks = function(which) {
  var callbacks = _super.call(this, which);
  if (which === 'rendered') {
    callbacks.push(autofocusRenderedCallback);
  }
  return callbacks;
};
