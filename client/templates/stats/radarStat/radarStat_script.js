Template.radarStat.helpers({

});

Template.radarStat.events({
  'click .backToPoll' () {
    Session.delete('currentStat');
  },
});

Template.radarStat.onRendered(function () {
  let voteId = Session.get('currentVoteId');
  let prezId = Router.current().params.prez;
  if (voteId) {
    Tracker.autorun(function () {
      let votes = Votes.findOne({ _id: prezId + '_' + voteId });
      if (votes) {
        console.log(votes);
      }
    });
  }
});
