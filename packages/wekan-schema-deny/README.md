[![CircleCI](https://circleci.com/gh/aldeed/meteor-schema-deny/tree/master.svg?style=svg)](https://circleci.com/gh/aldeed/meteor-schema-deny/tree/master)

# aldeed:schema-deny

A Meteor package that allows you to deny inserting or updating certain properties in your database by setting options in your schema.

## Installation

In your Meteor app directory, enter:

```bash
meteor add aldeed:schema-deny
```

## Usage

If you set `denyUpdate: true`, any collection update that modifies the field will fail. For instance:

```js
const postSchema = new SimpleSchema({
  title: {
    type: String
  },
  content: {
    type: String
  },
  createdAt: {
    type: Date,
    denyUpdate: true
  }
});

const Posts = new Mongo.Collection('posts');
Posts.attachSchema(postSchema);

const postId = Posts.insert({title: 'Hello', content: 'World', createdAt: new Date()});
```

The `denyInsert` option works the same way, but for inserts. If you set `denyInsert` to true, you will need to set `optional: true` as well.

## Contributing

Anyone is welcome to contribute. Fork, make and test your changes (`meteor test-packages ./`), and then submit a pull request.

### Running Tests

```bash
cd tests
npm i && npm test
```

### Running Tests in Watch Mode

```bash
cd tests
npm i && npm run test:watch
```
