Meteor.publish('Presentations', function () {
  return Presentations.find({ isPublic: true, isListed: true });
});

Meteor.publish('MyPresentations', function () {
  if (this.userId) {
    return Presentations.find({ owners: this.userId });
  }
  return false;
});

Meteor.publish('Presentation', function (prezId) {
  return Presentations.find({ _id: prezId });
});

Meteor.publish('Viewers', function (prezId) {
  return Viewers.find({ _id: prezId });
});

Meteor.publish('Votes', function (prezId) {
  let query = {};
  query[prezId] = { $exists: 1 };
  return Votes.find(query);
});
