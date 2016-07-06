Meteor.methods({
  upsertVote (prezId, questionId, answers) {
    if (this.userId) {
      check(prezId, String);
      check(questionId, String);
      check(answers, Array);
      let update = {};
      update[prezId + '.' + questionId] = answers;
      Votes.upsert({ _id: this.userId }, { $set: update });
    }
  },
});
