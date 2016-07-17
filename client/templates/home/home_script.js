Template.home.helpers({
  presentations () {
    return Presentations.find({ isPublic: true, isListed: true }, {sort: {createdAt: -1}}).fetch();
  },
  myPresentations () {
    if (Meteor.userId()) {
      return Presentations.find({ owners: Meteor.userId() }, {sort: {createdAt: -1}}).fetch();
    }
    return false;
  },
});

Template.home.events({
  'click .createPrezBigBtn' () {
    $('.createPrez').click();
  },
});

Template.home.onRendered(function () {
  this.subscribe('Presentations');
  this.subscribe('MyPresentations');
  $('.createPrezBigBtn').transition('tada');
  $('.item').popup();
});
