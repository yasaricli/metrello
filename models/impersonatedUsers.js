import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const ImpersonatedUsers = new Mongo.Collection('impersonated_users');

if (Meteor.isServer) {
  ImpersonatedUsers.createIndex({ userId: 1 }, { unique: true });
}

const ImpersonatedUsersSchema = new SimpleSchema({
  type: {
    type: String,
    optional: true,
    defaultValue: 'user'
  },
  adminId: {
    type: String,
    optional: true,
  },
  userId: {
    type: String,
    optional: true,
  },
  boardId: {
    type: String,
    optional: true,
  },
  attachmentId: {
    type: String,
    optional: true,
  },
  reason: {
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

ImpersonatedUsers.attachSchema(ImpersonatedUsersSchema);

export default ImpersonatedUsers;
