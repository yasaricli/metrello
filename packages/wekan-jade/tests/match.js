var removeLineComment = function (code) {
  var lineBreak = "\n";
  return _.map(code.split(lineBreak), function (line) {
    return line.replace(/(.+?)\s*\/\/ [0-9]+/, "$1");
  }).join(lineBreak);
};

var tpl2txt = function(tplName) {
  var tpl = Template[tplName];
  if (! tpl.renderFunction)
    throw Error("The template object doesn't have a render function");
  return removeLineComment(tpl.renderFunction.toString());
};

Tinytest.add('Jade - Compiled template match Spacebars', function (test) {
  for (var jadeTplName in Template) {
    if (! jadeTplName.match(/^match-jade/))
      continue;

    var parts = jadeTplName.split('-');
    var testName = parts[2];
    var testIndex = parts[3];
    var description = testName + (testIndex ? " (" + testIndex + ")" : "");
    var htmlTplName = ["match", "html", testName].join("-");

    if (_.has(Template, htmlTplName))
      test.equal(tpl2txt(jadeTplName), tpl2txt(htmlTplName), description);
    else
      test.fail("Missing template: " + htmlTplName);
  }
});
