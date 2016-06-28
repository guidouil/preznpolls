Template.simplePoll.helpers({
  color () {
    let presentationId = Router.current().params.prez;
    let presentation = Presentations.findOne({_id: presentationId});
    if (presentation && presentation.color) {
      return presentation.color;
    }
    return false;
  },
});

Template.simplePoll.events({
  'click .button' (evt) {
    let presentationId = Router.current().params.prez;
    if (presentationId) {
      Presentations.update({ _id: presentationId },
        { $set: { color: evt.currentTarget.innerText }}
      );
    }
    Meteor.call('upsertVote', 'color', evt.currentTarget.innerText);
    Session.set('currentStat', 'pieStat');
    Session.set('currentVoteId', 'color');
  },
});

Template.simplePoll.onRendered(function () {
  let editor = new MediumEditor('.editable');
});
