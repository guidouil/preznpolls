Template.home.helpers({
  presentations () {
    return Presentations.find({}, {sort: {name: 1}}).fetch();
  },
});

Template.home.events({
});

Template.home.onRendered(function () {

});
