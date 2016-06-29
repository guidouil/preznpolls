Template.imagesPoll.helpers({
});

Template.imagesPoll.events({
  'click .card' (evt) {
    Meteor.call('upsertVote', 'avatar', evt.currentTarget.dataset.ref);
    Session.set('currentStat', 'pieStat');
    Session.set('currentVoteId', 'avatar');
  },
});

Template.imagesPoll.onRendered(function () {
});
