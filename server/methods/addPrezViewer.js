Meteor.methods({
  addPrezViewer: function (prezId) {
    check(prezId, String);
    if (this.userId) {
      Presentations.update({ _id: prezId }, {$addToSet: { viewers: this.userId }});
    }
    return true;
  },
});
