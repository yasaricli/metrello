import SimpleSchema from 'simpl-schema';
import { ReactiveCache } from '/imports/reactiveCache';
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'meteor/aldeed:simple-schema';

const commentReactionSchema = new SimpleSchema({
  reactionCodepoint: {
    type: String,
    optional: false,
    max: 9, // max length of reaction code
    custom() {
      if (!this.value.match(/^&#\d{4,6};$/)) { // regex for only valid reactions
        return "incorrectReactionCode";
      }
    },
  },
  userIds: {
    type: Array,
    defaultValue: []
  },
  'userIds.$': {
    type: String,
  }
});

CardCommentReactions = new Mongo.Collection('card_comment_reactions');

/**
 * All reactions of a card comment
 */
CardCommentReactions.attachSchema(
  new SimpleSchema({
    boardId: {
      /**
       * the board ID
       */
      type: String,
      optional: false
    },
    cardId: {
      /**
       * the card ID
       */
      type: String,
      optional: false
    },
    cardCommentId: {
      /**
       * the card comment ID
       */
      type: String,
      optional: false
    },
    reactions: {
      type: Array,
      defaultValue: []
    },
    'reactions.$': {
      type: commentReactionSchema
    }
  }),
);

CardCommentReactions.allow({
  insert(userId, doc) {
    return allowIsBoardMember(userId, ReactiveCache.getBoard(doc.boardId));
  },
  update(userId, doc) {
    return allowIsBoardMember(userId, ReactiveCache.getBoard(doc.boardId));
  },
  remove(userId, doc) {
    return allowIsBoardMember(userId, ReactiveCache.getBoard(doc.boardId));
  },
  fetch: ['boardId'],
});


if (Meteor.isServer) {
  Meteor.startup(() => {
    CardCommentReactions._collection.createIndex({ cardCommentId: 1 }, { unique: true });
  });
}
