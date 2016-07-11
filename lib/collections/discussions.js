Discussions = new Mongo.Collection('discussions');

Discussions.allow({
  insert: function () {
    return true;
  },
  update: function () {
    return true;
  },
  remove: function () {
    return true;
  },
});
