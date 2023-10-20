// collection2 checks to make sure that simpl-schema package is added
import SimpleSchema from 'simpl-schema';
import Collection2 from 'meteor/wekan-collection2';

// Extend the schema options allowed by SimpleSchema
SimpleSchema.extendOptions(['denyInsert', 'denyUpdate']);

Collection2.on('schema.attached', (collection, ss) => {
  if (ss.version >= 2 && ss.messageBox && typeof ss.messageBox.messages === 'function') {
    ss.messageBox.messages({
      en: {
        insertNotAllowed: '{{label}} cannot be set during an insert',
        updateNotAllowed: '{{label}} cannot be set during an update',
      },
    });
  }

  ss.addValidator(function schemaDenyValidator() {
    if (!this.isSet) return;

    const def = this.definition;

    if (def.denyInsert && this.isInsert) return 'insertNotAllowed';
    if (def.denyUpdate && (this.isUpdate || this.isUpsert)) return 'updateNotAllowed';
  });
});
