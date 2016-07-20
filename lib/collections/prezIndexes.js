PrezIndexes = new Mongo.Collection('prezIndexes');

PrezIndexes.allow({
  insert: function (userId, doc) {
    return userId && _.contains(doc.owners, userId);
  },
  update: function (userId, doc) {
    return userId && _.contains(doc.owners, userId);
  },
  remove: function (userId, doc) {
    return userId && _.contains(doc.owners, userId);
  },
  fetch: ['owners'],
});

let PrezIndexesSchema = new SimpleSchema({
  chapterViewIndex: {
    type: Number,
    autoValue: function () {
      if (this.isInsert) {
        return 0;
      }
    },
  },
  slideViewIndex: {
    type: Number,
    autoValue: function () {
      if (this.isInsert) {
        return 0;
      }
    },
  },
  flip: {
    type: String,
    autoValue: function () {
      if (this.isInsert) {
        return 'ping';
      }
    },
  },
  owners: {
    type: [String],
    regEx: SimpleSchema.RegEx.Id,
    optional: true,
    autoValue: function () { if (this.isInsert) { return [this.userId]; }}
  },
  users: {
    type: [String],
    regEx: SimpleSchema.RegEx.Id,
    optional: true,
  },
  viewers: {
    type: [String],
    regEx: SimpleSchema.RegEx.Id,
    optional: true,
  },
});

PrezIndexes.attachSchema(PrezIndexesSchema);
