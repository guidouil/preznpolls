Template.videoSlide.helpers({
});

Template.videoSlide.events({
});

Template.videoSlide.onRendered(function () {
  makeEditable();
  $('.ui.embed').embed();
});
