// XXX Remove this file when PR jade#1392 is merged and released
// https://github.com/visionmedia/jade/pull/1392
//
// The goal of the PR is to add a `lexer` option to the parser so that the user
// could provide his own customized Lexer object.

Parser = function (str, filename, options){
  //Strip any UTF-8 BOM off of the start of `str`, if it exists.
  this.input = str.replace(/^\uFEFF/, '');
  this.filename = filename;
  this.blocks = {};
  this.mixins = {};
  this.options = options || {};
  // <mquandalle>
  var Constructor = this.options.lexer || Lexer;
  this.lexer = new Constructor(this.input, filename);
  // </mquandalle>
  this.contexts = [this];
  this.inMixin = false;
};

Parser.prototype = Npm.require('jade').Parser.prototype;

var nodes = Npm.require('jade').nodes;

// XXX Horrible hack
// We overwrite the `parseMixin` function to introduce a special case for the
// `markdown` component.
var _super = Parser.prototype.parseMixin;
Parser.prototype.parseMixin = function() {
  var tok = this.peek();
  var mixin;

  if (tok.type === "mixin" && tok.val === "markdown") {
    this.advance();
    this.lexer.pipeless = true;
    mixin = new nodes.Mixin("markdown", "", this.parseTextBlock(), false);
    this.lexer.pipeless = false;
    return mixin;

  } else {
    return _super.call(this);
  }
};
