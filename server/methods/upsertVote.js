Meteor.methods({
  upsertVote (prezId, chapterIndex, slideIndex, questionIndex, votes) {
    if (this.userId) {
      check(prezId, String);
      check(chapterIndex, Number);
      check(slideIndex, Number);
      check(questionIndex, Number);
      check(votes, Array);
      let update = {};
      update['presentations.' + prezId + '.chapters.' + chapterIndex + '.slides.' + slideIndex + '.questions.' + questionIndex + '.answers'] = votes;
      Votes.upsert({ _id: this.userId }, { $set: update });
    }
  },
});
