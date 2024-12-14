import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export const Translation = new Mongo.Collection('translation');

// Define the schema with required fields
Translation.attachSchema(new SimpleSchema({
  code: {
    type: String,
  },
  language: {
    type: String,
  },
  createdAt: {
    type: Date,
    optional: true,
    // Set default value to avoid schema validation errors
    autoValue() {
      if (this.isInsert) {
        return new Date();
      }
      return this.unset();
    },
  },
  // Add any other required fields
}));

if (Meteor.isServer) {
  Translation._ensureIndex({ code: 1 });
}

export default Translation;
