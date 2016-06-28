Meteor.methods({
  upsertVote (voteId, voteValue) {
    check(voteId, String);
    check(voteValue, String);
    let update = {};
    update[voteValue] = 1;
    Votes.upsert({_id: voteId}, {$inc: update});
  },
});
