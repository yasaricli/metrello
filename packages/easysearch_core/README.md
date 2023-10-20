Easy Search Core
=====================

The core package allows you to search indexes with configured engines through the Javascript API. The `easy:search` package wraps this package together with `easysearch:components` for convenience.

```javascript
import { Index, MongoDBEngine } from 'meteor/easysearch:core'

// On Client and Server
const Players = new Mongo.Collection('players')
const PlayersIndex = new Index({
  collection: Players,
  fields: ['name'],
  engine: new MongoDBEngine(),
})

Tracker.autorun(() => {
  const cursor = PlayersIndex.search('Peter')

  console.log(cursor.fetch()) // logs the documents
  console.log(cursor.count()) // logs the count of all matched documents
})
```

## How to install

```sh
cd /path/to/project
meteor add easysearch:core
```

NB: This package will use the `erasaur:meteor-lodash` package if it is already installed in your application, else it will fallback to the standard Meteor `underscore` package.
