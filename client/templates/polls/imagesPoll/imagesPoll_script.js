Template.imagesPoll.helpers({
});

Template.imagesPoll.events({
  'click .card' (evt) {
    let prezId = Router.current().params.prez;
    Meteor.call('upsertVote', prezId, 'avatar', evt.currentTarget.dataset.ref);
    Session.set('currentStat', 'pieStat');
    Session.set('currentVoteId', 'avatar');
  },
});

Template.imagesPoll.onRendered(function () {
  let editor = new MediumEditor('.editable');
});
