# Component methods in EasySearch

All the EasySearch components use the api that is [defined here](https://github.com/matteodem/meteor-easy-search/blob/master/packages/easysearch:components/lib/component-methods.js#L1). You can do
things such as `search`, `loadMore` or `paginate` and render them by using `EasySearch.Each` (and other components).

```js 
import { peopleIndex } from './search/people-index'
// instanceof EasySearch Index

const methods = peopleIndex.getComponentMethods(/* optional name */)

methods.search('peter')
```

Consider having a look at the [source code](https://github.com/matteodem/meteor-easy-search/blob/master/packages/easysearch:components/lib/component-methods.js#L1) for all the methods.
Don't forget to pass in a name if you have defined one in your blaze components.
