Meteor.methods({
  upsertVote (prezId, voteId, voteValue, incValue) {
    if (! incValue) {
      incValue = 1;
    }
    check(prezId, String);
    check(voteId, String);
    check(voteValue, String);
    let update = {};
    update[voteValue] = incValue;
    Votes.upsert({_id: prezId + '_' + voteId}, {$inc: update});
  },
});
