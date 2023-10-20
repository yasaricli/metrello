import { Template } from 'meteor/templating'
import { SingleIndexComponent } from 'meteor/easysearch:components'

const getDataValue = (scope, val, defaultVal) => scope.getData()[val] || defaultVal

class AutosuggestComponent extends SingleIndexComponent
{
  /**
   * Search autosuggest by given string.
   *
   * @param {String} str
   * @returns {Cursor}
   */
  search(str) {
    const methods = this.index.getComponentMethods(this.name)

    methods.search(str)

    return methods.getCursor()
  }

  /**
   * Setup autosuggest on rendered
   */
  onRendered() {
    let handle
    let computation

    const valueField = getDataValue(this, 'valueField', '_id')
    const labelField = getDataValue(this, 'labelField', this.index.config.fields[0])
    const searchField = getDataValue(this, 'searchField', labelField)
    const changeConfiguration = getDataValue(this, 'changeConfiguration', (c) => c)
    const suggestionTemplate = Template[
      getDataValue(
        this,
        'renderSuggestion',
        'EasySearch_Autosuggest_DefaultRenderSuggestion'
      )
    ]

    const select = this.$('select').selectize(changeConfiguration({
      valueField,
      labelField,
      searchField,
      create: false,
      preload: true,
      render: {
        option: (item, escape) => Blaze.toHTMLWithData(suggestionTemplate, {
          doc: item,
          _id: item._id,
          label: _.get(item, labelField)
        })
      },
      load: (query, callback) => {
        if (computation) {
          computation.stop()
        }

        computation = Tracker.autorun(() => {
          const cursor = this.search(query)
          const docs = cursor.fetch()

          if (handle) {
            clearTimeout(handle)
          }

          handle = setTimeout(() => {
            select[0].selectize.clearOptions()
            callback(docs)
          }, 100)
        })
      }
    }))
  }
}

AutosuggestComponent.register('EasySearch.Autosuggest')

export { AutosuggestComponent }
