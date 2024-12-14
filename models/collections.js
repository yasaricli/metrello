import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

// Helper function for schema validation
const validateDocument = (doc, schema) => {
  const errors = [];
  Object.keys(schema).forEach(field => {
    const value = doc[field];
    const rules = schema[field];

    if (rules.required && !value) {
      errors.push(`${field} is required`);
    }
    if (rules.type && value !== undefined && typeof value !== rules.type) {
      errors.push(`${field} must be of type ${rules.type}`);
    }
  });
  return errors;
};

// Collection definitions
export const Boards = new Mongo.Collection('boards');
export const Lists = new Mongo.Collection('lists');
export const Cards = new Mongo.Collection('cards');

// Schema definitions
const schemas = {
  boards: {
    title: { type: 'string', required: true },
    ownerId: { type: 'string', required: true },
    // ...existing schema fields...
  },
  // Add other schemas as needed
};

// Secure methods instead of allow/deny
Meteor.methods({
  'boards.insert'(doc) {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    const errors = validateDocument(doc, schemas.boards);
    if (errors.length) {
      throw new Meteor.Error('validation-failed', errors.join(', '));
    }

    return Boards.insert({
      ...doc,
      createdAt: new Date(),
      createdBy: this.userId
    });
  },

  'boards.update'(boardId, modifier) {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    const board = Boards.findOne(boardId);
    if (!board || board.ownerId !== this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    return Boards.update(boardId, modifier);
  },

  // Add other methods as needed
});

// Add MongoDB validation on collections
if (Meteor.isServer) {
  Boards.rawCollection().createIndexes([
    {
      key: { title: 1 },
      partialFilterExpression: { title: { $exists: true } }
    }
  ]);

  // Add other indexes and validations as needed
}
