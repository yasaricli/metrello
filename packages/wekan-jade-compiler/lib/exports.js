var codeGen = SpacebarsCompiler.codeGen;

JadeCompiler = {
  parse: function(source, options) {
    options = options || {};
    var parser, Compiler;

    try {
      parser = new Parser(source, options.filename || "", { lexer: Lexer });
      Compiler = (options.fileMode) ? FileCompiler : TemplateCompiler;
      return new Compiler(parser.parse(), options).compile();

    } catch (err) {
      throw err;
    }
  },

  compile: function(source) {
    var ast = JadeCompiler.parse(source, { fileMode: false });
    return codeGen(ast);
  }
};
