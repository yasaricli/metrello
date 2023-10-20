Easy Search Autosuggest
=====================

This package adds an autosuggest blaze component that uses __selectize__ (`jeremy:selectize`) to handle the display logic itself and
__EasySearch__ for the search. Like the [EasySearch Components](#putInLink) it only requires you to specify an index.

```html
<template name="awesomeAutosuggest">
  <!-- searchIndex typeof EasySearch.Index -->
  {{> EasySearch.Autosuggest index=searchIndex }}
</template>
```

## Parameters

You can pass in following parameters to the `EasySearch.Autosuggest` component.
* __valueField__: String that specifies the document field that contains the autosuggest value, by default "_id"
* __labelField__: String that specifies the search result field to display, by default the first of index `fields`
* __changeConfiguration__: Function to change the configuration that is passed to selectize.
* __renderSuggestion__: String that specifies a custom template to render the autosuggest, by default `EasySearch_Autosuggest_DefaultRenderSuggestion`
* __noDocumentsOnEmpty__: Same as for EasySearch.Input

## How to install

```sh
cd /path/to/project
meteor add easysearch:autosuggest
```
