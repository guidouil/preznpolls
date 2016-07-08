Meteor.methods({
  resetVotes (prezId) {
    let query = {};
    query[prezId] = {$exists: 1};
    let votes = Votes.find(query).fetch();
    query[prezId] = '';
    if (votes) {
      _.each(votes, function (vote) {
        Votes.update({ _id: vote._id }, { $unset: query });
      });
    }
  },
});
