Meteor.methods({
  checkPrezId: function (prezId) {
    check(prezId, String);
    if (this.userId) {
      let prez = Presentations.findOne({_id: prezId});
      if (! prez) {
        return true;
      }
    }
    return false;
  },
});
