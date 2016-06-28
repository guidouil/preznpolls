Template.home.helpers({
  presentations () {
    return Presentations.find({}).fetch();
  },
});

Template.home.events({
});

Template.home.onRendered(function () {

});
