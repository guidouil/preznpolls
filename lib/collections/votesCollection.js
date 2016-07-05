Votes = new Mongo.Collection('votes');

Votes.allow({
  insert: function (userId, doc) {
    return userId && doc._id === userId;
  },
  update: function (userId, doc) {
    return userId && doc._id === userId;
  },
  remove: function (userId, doc) {
    return userId && doc._id === userId;
  },
});
