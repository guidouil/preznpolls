Meteor.methods({
  upsertDiscussion (prezId, message) {
    if (this.userId) {
      check(prezId, String);
      check(message, String);
      let discussion = {
        what: message,
        when: new Date(),
        who: this.userId,
      };
      Discussions.upsert({ _id: prezId }, { $push: { discussion: discussion}});
    }
  },
});
