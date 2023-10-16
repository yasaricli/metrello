## v0.4.9

* Recompile jade files when their name change #199

## v0.4.8

* Fix a critical bug when running `meteor build` on 0.4.{6,7} #195 (again)

## v0.4.7

* Fix a critical bug when running `meteor build` on 0.4.6 #195

## v0.4.6

* Fix file caching on the new “Batch Plugin” API

## v0.4.5

* Support Meteor 1.2 “Batch Plugin” API

## v0.4.4

*requires Meteor 1.2*

* Add a missing runtime dependency, `blaze`
* Fix Meteor 1.2 compatibility #175

## v0.4.3

* Support body attributes #121
* Support reactives mustaches in “style” tags #102
* Fix char reference handling in tag attributes #106

## v0.4.2

* Fix tags support inside “dot-notation” blocks #92 #109

## v0.4.1

* Fix a package dependency issue #104

## v0.4.0

* Split the jade package in two parts `jade-compiler` and `jade` (the source
handler) so that the compiler can be used by third parties packages (as
`meteorhacks:ssr`).
* Support the new `.tpl.jade` source handler for unwrapped jade templates

## v0.3.0

* Remove deprecated `:markdown` filter
* Fix `+markdown` support #13 #55
* Support block of texts using the jade “dot notation”

## v0.2.9

* Support JavaScript string expressions #68
* Support multilines components with parenthesis #79
* Support parentheses in component text attribute #85
* Fix `Template.dynamic` #75

## v0.2.8

*requires Meteor 9.1*

* Support non-standard tags #61
* Clean the output in case of a syntax error #67
* Update the code generated to instanciate templates
* Update the leaderboard example #72 #73

## v0.2.7

*requires Meteor 0.9*

* Deprecate markdown server-side filter (this will be handled by meteor
server-side rendering when available)
* Modifications for the new packaging system

## v0.2.6

* Drop support for `.html.jade` extension
* Bugfix: Body template runtime error #50
* Bugfix: Empty tag argument exception

## v0.2.5

*requires Meteor 0.8.3*

* Interpose a new line between component children #44
* Optimize arrays in the generated javascript
* Special case for `<textarea>` handling

## v0.2.4

* Support the `!{ jade }` syntax for unescaped HTML insertion #36
* Bugfix: lexer exception introduced in v0.2.3 #35

## v0.2.3

* Interpose a new line between tag children #29
* Bugfix: `iframe` parsing #33

## v0.2.2

*requires Meteor 0.8.1*

* Deprecate `.html.jade` extension. Always use `.jade`, there is no more load
order issue
* Bugfix: support for optional brackets wrapping component arguments #22
* Bugfix: dynamic helper with the `$dyn` keyword #24

## v0.2.1

* Introduce a new method for testing
* Bugfix: user components with keyword arguments #19

## v0.2.0

*requires Meteor 0.8*

* Supports jade expressions inside HTML attributes #10
* Use a custom fork of jade

## v0.1.5

* Fix single attribute (`required`, `checked`...) compilation
* Better error reporting #6
* Support the dot notation for templates inclusion #11
* Add a lot of tests

## v0.1.4

*requires Meteor `blaze-rc1`*

* Upgrade `jade` from 1.2.0 to 1.3.0

## v0.1.3

*requires Meteor `blaze-rc0`*

* Upgrade `jade` from 1.1.5 to 1.2.0
* Bugfix: link with atmosphere

## v0.1.2

* Fix multiple jade-style expressions in a single block of text #4

## v0.1.1

* Fix user-defined-component inclusion #3
* Improve the `[if, elseif, else]` stack managment

## v0.1.0

* Support Jade expressions
* Support the Meteor UI component model
* Syntaxic sugar for default components (`if`, `unless`, `with` and `each`)
* Syntaxic sugar for `else if`
* Server-side filter: `:markdown`
