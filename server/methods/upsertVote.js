Meteor.methods({
  upsertVote (prezId, questionId, answers) {
    if (this.userId) {
      check(prezId, String);
      check(questionId, String);
      check(answers, Array);
      let query = {};
      query[prezId + '.' + questionId] = answers;
      Votes.upsert({ _id: this.userId }, { $set: query });
    }
  },
});
