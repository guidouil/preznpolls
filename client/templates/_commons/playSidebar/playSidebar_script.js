let moment = require('moment');

Template.playSidebar.onCreated(function () {
  this.subscribe('Discussion', Router.current().params.prez);
  this.clock = new ReactiveVar(moment().format('H:mm'));
});

Template.playSidebar.helpers({
  messages () {
    let discussion = Discussions.findOne({ _id: Router.current().params.prez });
    if (discussion) {
      return discussion.discussion;
    }
    return false;
  },
  clock () {
    return Template.instance().clock.get();
  },
});

Template.playSidebar.events({
  'click .closeChat': function () {
    $('.playSidebar').sidebar('hide');
  },
  'click .postMessage': function () {
    let message = $('#messageInput').val();
    if (message) {
      Meteor.call('upsertDiscussion', Router.current().params.prez, message);
      $('#messageInput').val('');
    }
  },
  'keyup #messageInput': function(event) {
    if (event.which === 13) {
      event.stopPropagation();
      $('.postMessage').click();
    }
  },
  'click .deleteMessage' () {
    Discussions.update({ _id: Router.current().params.prez }, {$pull: { discussion: this }});
  },
});

Template.playSidebar.onRendered(function () {
  let template = this;
  Meteor.setInterval(function () {
    template.clock.set(moment().format('H:mm'));
  }, 1000);
});
