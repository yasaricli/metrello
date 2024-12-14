import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { EasySchema } from 'meteor/jam:easy-schema';

export const Translation = new Mongo.Collection('translation');

// Define the schema for translations
const TranslationSchema = new EasySchema({
  languageCode: {
    type: String,
    max: 5,
  },
  text: {
    type: String,
    optional: true,
  },
  createdAt: {
    type: Date,
    autoValue() {
      if (this.isInsert) {
        return new Date();
      }
      return this.unset();
    },
  },
  modifiedAt: {
    type: Date,
    autoValue() {
      return new Date();
    },
  },
});

Translation.attachSchema(TranslationSchema);

if (Meteor.isServer) {
  Translation.allow({
    insert(userId) {
      return userId && Meteor.user().isAdmin;
    },
    update(userId) {
      return userId && Meteor.user().isAdmin;
    },
    remove(userId) {
      return userId && Meteor.user().isAdmin;
    },
    fetch: [],
  });
}

export default Translation;
