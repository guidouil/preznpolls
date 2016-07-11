Template.playSidebar.helpers({
});

Template.playSidebar.events({
  'click .closeChat': function () {
    $('.playSidebar').sidebar('hide');
  },
  'click .postMessage': function () {
    
  },
  'keyup .replyBox': function(event) {
    if (event.which === 13) {
      event.stopPropagation();
      $('.postMessage').click();
    }
  },
});

Template.playSidebar.onRendered(function () {
});
