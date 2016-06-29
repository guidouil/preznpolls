Template.pointsPoll.helpers({
  pollOptions () {
    return [
      {
        title: 'Simplicity',
        description: 'There is beauty in simplicity',
      },
      {
        title: 'Design',
        description: 'Creativity is what we are all about',
      },
      {
        title: 'Power',
        description: 'With great power comes great responsibility',
      },
      {
        title: 'Awareness',
        description: 'Knowledge or perception of a situation or fact',
      },
      {
        title: 'Awesomeness',
        description: 'Everything is awesome when we\'re part of a team',
      },
      {
        title: 'Connectivity',
        description: 'Because, the Internet',
      },
      {
        title: 'Beauty',
        description: 'What is beautiful is good and more accurately understood',
      },
      {
        title: 'Price',
        description: 'In the end you allways have to count',
      },
    ];
  },
});

Template.pointsPoll.events({
  'click .threePoints' (evt) {
    let presentationId = Router.current().params.prez;
    Meteor.call('upsertVote', presentationId, 'points', this.title, 3);
    $('.threePoints').addClass('disabled');
    $(evt.currentTarget).siblings().addClass('disabled');
    Session.set('clickCount', Session.get('clickCount') + 1);
  },
  'click .twoPoints' (evt) {
    let presentationId = Router.current().params.prez;
    Meteor.call('upsertVote', presentationId, 'points', this.title, 2);
    $('.twoPoints').addClass('disabled');
    $(evt.currentTarget).siblings().addClass('disabled');
    Session.set('clickCount', Session.get('clickCount') + 1);
  },
  'click .onePoint' (evt) {
    let presentationId = Router.current().params.prez;
    Meteor.call('upsertVote', presentationId, 'points', this.title, 1);
    $('.onePoint').addClass('disabled');
    $(evt.currentTarget).siblings().addClass('disabled');
    Session.set('clickCount', Session.get('clickCount') + 1);
  },
});

Template.pointsPoll.onCreated(function () {
  Session.set('clickCount', 0);
});

Template.pointsPoll.onRendered(function () {
  let presentationId = Router.current().params.prez;
  Tracker.autorun(function () {
    if (Session.equals('clickCount', 3)) {
      Meteor.call('upsertVote', presentationId, 'points', 'totalVotes');
      Session.set('currentStat', 'columnStat');
      Session.set('currentVoteId', 'points');
    }
  });
});
