/**
 * The FieldInputComponent lets you search through configured indexes for a specified fild.
 *
 * @type {FieldInputComponent}
 */
EasySearch.FieldInputComponent = class FieldInputComponent extends EasySearch.InputComponent {
  /**
   * Setup component on created.
   */
  onCreated() {
    super.onCreated();

    if (_.isEmpty(this.getData().field)) {
      throw new Meteor.Error('no-field', 'Please provide a field for your field input component');
    }
  }

  /**
   * Search the component.
   *
   * @param {String} searchString String to search for
   */
  search(searchString) {
    check(searchString, String);

    this.eachIndex((index, name) => {
      let searchDefinition = index.getComponentDict(name).get('searchDefinition') || {};

      if (_.isString(searchDefinition)) {
        throw new Meteor.Error('You can either EasySearch.FieldInput or EasySearch.Input');
      }

      if (this.options.field) {
        searchDefinition[this.options.field] = searchString;
        index.getComponentMethods(name).search(searchDefinition);
      }
    });
  }
};

EasySearch.FieldInputComponent.register('EasySearch.FieldInput');
