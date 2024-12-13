import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const Translation = new Mongo.Collection('translation');

Translation.attachSchema(
  new SimpleSchema({
    language: {
      type: String,
      max: 5,
    },
    text: {
      type: String,
    },
    translationText: {
      type: String,
      optional: true,
    },
    createdAt: {
      type: Date,
      // eslint-disable-next-line consistent-return
      autoValue() {
        if (this.isInsert) {
          return new Date();
        } else if (this.isUpsert) {
          return { $setOnInsert: new Date() };
        } else {
          this.unset();
        }
      },
    },
    modifiedAt: {
      type: Date,
      // eslint-disable-next-line consistent-return
      autoValue() {
        if (this.isInsert || this.isUpsert || this.isUpdate) {
          return new Date();
        } else {
          this.unset();
        }
      },
    },
  }),
);

// Remove deprecated allow rules

// Define Meteor methods instead of allow rules
if (Meteor.isServer) {
  Meteor.methods({
    setCreateTranslation(
      language,
      text,
      translationText,
    ) {
      check(language, String);
      check(text, String);
      check(translationText, String);

      const nTexts = ReactiveCache.getTranslations({ language, text }).length;
      if (nTexts > 0) {
        throw new Meteor.Error('text-already-taken');
      } else {
        Translation.insert({
          language,
          text,
          translationText,
        });
      }
    },
    setTranslationText(translation, translationText) {
      check(translation, Object);
      check(translationText, String);
      Translation.update(translation, {
        $set: { translationText: translationText },
      });
    },
  });
}

if (Meteor.isServer) {
  // Index for Organization User.
  Meteor.startup(() => {
    Translation._collection.createIndex({ modifiedAt: -1 });
  });
}

export default Translation;
