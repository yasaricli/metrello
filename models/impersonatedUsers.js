import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

// Create the collection
export const ImpersonatedUsers = new Mongo.Collection('impersonatedUsers');

// Define the schema
const ImpersonatedUsersSchema = new SimpleSchema({
  userId: {
    type: String,
  },
  impersonatedByUserId: {
    type: String,
  },
  impersonatedAt: {
    type: Date,
    defaultValue: new Date(),
  },
  active: {
    type: Boolean,
    defaultValue: true,
  }
});

// Create index on server
if (Meteor.isServer) {
  Meteor.startup(() => {
    ImpersonatedUsers.createIndex({ userId: 1 });
  });

  // Define methods for secure operations
  Meteor.methods({
    'impersonatedUsers.insert'(doc) {
      // Validate doc
      ImpersonatedUsersSchema.validate(doc);

      // Add security check
      if (!Meteor.userId() || !Meteor.user().isAdmin) {
        throw new Meteor.Error('not-authorized');
      }

      return ImpersonatedUsers.insert(doc);
    },

    'impersonatedUsers.update'(selector, modifier) {
      // Validate modifier
      ImpersonatedUsersSchema.validate(modifier, { modifier: true });

      // Add security check
      if (!Meteor.userId() || !Meteor.user().isAdmin) {
        throw new Meteor.Error('not-authorized');
      }

      return ImpersonatedUsers.update(selector, modifier);
    }
  });
}

// Remove direct operation capability
ImpersonatedUsers.insert = function() {
  throw new Meteor.Error('not-allowed', 'Direct inserts are not allowed. Use Meteor.call("impersonatedUsers.insert")');
};

ImpersonatedUsers.update = function() {
  throw new Meteor.Error('not-allowed', 'Direct updates are not allowed. Use Meteor.call("impersonatedUsers.update")');
};

export default ImpersonatedUsers;
