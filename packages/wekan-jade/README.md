# Jade for Meteor

[![Meteor Icon](http://icon.meteor.com/package/mquandalle:jade)][atmosphere]

This [Meteor](https://www.meteor.com/) package provides some support for the
[Jade](http://jade-lang.com/) template engine as a Spacebars alternative.

Spacebars and Jade packages can coexist, Spacebars will continue to compile
files ending with `.html` and Jade will take care of those ending with `.jade`.

## Table of Contents

* [Installation](#installation)
* [Examples](#examples)
* [Usage](#usage)
  * [Templates](#templates)
  * [HTML Tag attributes](#html-tag-attributes)
  * [Components](#components)
* [Additional features](#additional-features)
  * [else if](#else-if)
  * [Unwrapped templates](#unwrapped-templates)
  * [Anonymous helper](#anonymous-helper)
* [Unsupported Jade Features](#unsupported-features)
* [Contributing](#contributing)
  * [Implementation](#implementation)
  * [License](#license)
  * [Tests](#tests)
  * [Tips](#tips)
* [Known bugs](#known-bugs)
  * [Using Jade in a package](#using-jade-in-a-package)

## Installation

Meteor-jade is installable from [atmosphere][atmosphere], the meteor package
system:

```sh
$ meteor add mquandalle:jade
```

## Examples

Meteor comes with some examples such as leaderboard or todos. You'll find jade
versions of those examples templates and even more in the
[examples directory](examples/).

## Usage

Meteor-jade works somewhat like Jade, so if you never use Jade before you
should take a look at the [documentation](http://jade-lang.com/reference/).

There are some specifics rules relative to the Meteor way of handling templates.
These rules are mostly the same as the Spacebars ones.

### Templates

Every HTML tag must be in a template. You can define a template with the
following syntax:

```jade
template(name="myTemplate")
  p This paragraph is inside my template
```

There are two particular templates that are automatically rendered inside the
DOM: `head` and `body`. If you want to include a template inside another,
precede its name by the `+` symbol:

```jade
head
  title Leaderboard

body
  +leaderboard
  //- This is equivalent to {{> leaderboard}}
```

Inside a text node you can use both `{{spacebars}}` and `#{jade}` expressions
but the last one is recommended:

```jade
template(name="leaderboard")
  p Welcome #{player.name}
```

If you indent after a div or similar element, you can use `|` symbol in order jade not
to confuse with tags:

```jade
template(name='leaderboard')
  #content
   | #{greeting}
```

You can also use `=` as a shortcut:
```jade
template(name='leaderboard')
  #content
   = greeting
```

If you want to insert raw HTML you can use the `!{jade}` syntax which is
equivalent to the triple-braced `{{{spacebars}}}` expression.

### HTML Tag attributes

In Jade you define HTML Tag attributes inside parenthesis:

```jade
input(name="myName" placeholder="name" autofocus)
```

If you want to conditionally include a HTML Tag attribute you can use the
following syntax:

```jade
input(required = isRequired)
```

Where `isRequired` is a (potentially reactive) boolean defined in a template
helper. If you want to add a list of dynamic attributes use:

```jade
input($dyn = attrs)
```

Spacebars equivalent:

```html
<input {{attrs}}>
```

### Components

As you may already know, Meteor templates are "components" as well. To use a
template as a component, you simply have to provide a `content` block and
optionally a `elseContent` block after the inclusion:

```jade
body
  +ifEven(value=2)
    | Hello world
  else
    | Bye world

  //-
    This is the equivalent of:
    {{#ifEven value=2}}
      Hello world
    {{else}}
      Bye world
    {{/ifEven}}
    ifEven is a component defined by the user
    See the complete example in ./examples/components.jade
```

Like with Spacebars, a component can receive both ordered and keywords
arguments. Keywords arguments must be written after the ordered ones:

```
+myComponent(arg1 arg2 arg3 key1=val1 key2=val2)
```

Brackets are optional:

```
+myComponent arg1 arg2 arg3 key1=val1 key2=val2
```

For the four built-in components (`if`, `unless`, `each` and `with`) the `+`
is also optional:

```jade
ul
  each players
    if isSelected
      li.selected= name
    else
      li= name
```

## Additional features

We have some additional features over Spacebars.

### else if

We provide syntaxic sugar so you can write:

```jade
if user.isAdmin
  h1 Hello admin
else if user.isConnected
  h1 Hello user
else
  h1 Hello visitor
```

Instead of:

```jade
if user.isAdmin
  h1 Hello admin
else
  if user.isConnected
    h1 Hello user
  else
    h1 Hello visitor
```

Under the hood, those two codes are compiled to the same abstract tree, so there
are no runtime performance hit.

### Unwrapped templates

Putting each template in its own separate file and naming the file
after the template it contains is becoming a followed pattern among
Meteor developers. See for instance
[this article](http://joshowens.me/how-to-organize-your-meteor-js-app/)
from Josh Owens.

But as it stands today, this pattern doesn't respect the “don't repeat yourself”
(DRY) philosophy. Indeed you have to wrap your template in a
`<template name="myTemplate>` tag and saving it in a `myTemplate.html` file,
effectively writing the name of the template twice. If those two names doesn't
match Meteor will consider the name of the `<template>` tag and will ignore the
file name. So if you follow this pattern you have to take care of keeping the
file name and the template tag name in sync (manually).

We solve this problem using a new the `.tpl.jade` file extension. With it you
can only define one template per file and you don't need to wrap your template
in a tag. The template will be named after the file name. We handle special
`head.tpl.jade` and `body.tpl.jade` templates as expected.


### Anonymous helper

**This feature is not yet implemented.**  However, once implemented it could:

```jade
if player.score > 10
  p Well done!
```

It'll be useful for conditions (`if`, `else if` and `unless`) and inside
attributes.

See [related issue](https://github.com/mquandalle/meteor-jade/issues/1)

## Unsupported Features

Currently the following Jade features are not supported by `meteor-jade`.

- Code
- Case
- Filter

## Contributing

Contributions are welcome, whether it is for a
[bug report](https://github.com/mquandalle/meteor-jade/issues/new), a fix or a
new functionnality proposition.

### Implementation

This package use the Jade lexer to define the grammar, we just add a few customs
rules specifics to the Meteor components model. Then we use the Jade parser
which returns a syntax tree that we transform to make it compatible with the
Meteor format. We finally rely on the Spacebars compiler to generate the
JavaScript code sent to the client.

Everything is executed at bundle time.

### License

This code is published under the [MIT license](LICENSE).

### Tests

Use the following command to run the tests:

```
$ meteor test-packages packages/*
```

### Tips

If you want to buy me a beer, I proudly accept bitcoin tips:
[1Jade7Fscsx2bF13iFVVFvcSUhe7eLJgSy][blockchain]

## Known bugs

### Using Jade in a package

When using Jade in a package you need to lock the version to the [latest
version](https://github.com/mquandalle/meteor-jade/blob/master/packages/jade/package.js#L3) manually. See
[issue #83](https://github.com/mquandalle/meteor-jade/issues/83).

```javascript
api.use([
  "templating",
  "mquandalle:jade@0.4.5"
], "client");
```

[blockchain]: https://blockchain.info/address/1Jade7Fscsx2bF13iFVVFvcSUhe7eLJgSy
[atmosphere]: https://atmospherejs.com/mquandalle/jade
