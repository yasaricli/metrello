import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const Translations = new Mongo.Collection('translations');

const TranslationsSchema = new SimpleSchema({
  type: {
    type: String,
    optional: true,
    defaultValue: 'text',
  },
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
    autoValue() {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return { $setOnInsert: new Date() };
      } else {
        this.unset();
      }
    }
  },
  modifiedAt: {
    type: Date,
    autoValue() {
      if (this.isInsert || this.isUpsert || this.isUpdate) {
        return new Date();
      } else {
        this.unset();
      }
    }
  }
});

Translations.attachSchema(TranslationsSchema);

// Server methods
if (Meteor.isServer) {
  Meteor.methods({
    setCreateTranslation(language, text, translationText) {
      check(language, String);
      check(text, String);
      check(translationText, String);

      const nTexts = ReactiveCache.getTranslations({language, text}).length;
      if (nTexts > 0) {
        throw new Meteor.Error('text-already-taken');
      }

      return Translations.insert({
        type: 'custom',
        language,
        text,
        translationText
      });
    },

    setTranslationText(translation, translationText) {
      check(translation, Object);
      check(translationText, String);

      return Translations.update(translation._id, {
        $set: { translationText }
      });
    },

    searchTranslations(searchTerm, language, limit = 10) {
      check(searchTerm, String);
      check(language, Match.Maybe(String));
      check(limit, Number);

      const query = {
        $text: { $search: searchTerm }
      };

      if (language) {
        query.language = language;
      }

      return Translations.find(
        query,
        {
          limit,
          fields: {
            score: { $meta: 'textScore' }
          },
          sort: {
            score: { $meta: 'textScore' }
          }
        }
      ).fetch();
    }
  });

  // Create indexes on startup
  Meteor.startup(() => {
    Translations._collection.createIndex({ modifiedAt: -1 });
    // Add text index for search
    Translations._collection.createIndex(
      { text: 'text', translationText: 'text' },
      { name: 'translations_text_search' }
    );
  });
}

export default Translations;
