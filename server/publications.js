Meteor.publish('Presentation', function (prezId) {
  return Presentations.find({ _id: prezId });
});

Meteor.publish('Votes', function (prezId) {
  let query = {};
  query[prezId] = { $exists: 1 };
  return Votes.find(query);
});
