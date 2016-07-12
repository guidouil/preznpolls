let getOwnersAndUsers = function (template) {
  Meteor.call('getPrezOwnersAndUsers', Router.current().params.prez, function (err, result) {
    if (result.owners) {
      template.owners.set(result.owners);
    }
    if (result.users) {
      template.users.set(result.users);
    }
  });
};


Template.settings.onCreated(function () {
  let template = this;
  template.subscribe('Presentation', Router.current().params.prez);
  template.subscribe('Viewers', Router.current().params.prez);
  template.subscribe('Votes', Router.current().params.prez);
  template.owners = new ReactiveVar(false);
  template.users = new ReactiveVar(false);
  getOwnersAndUsers(template);
});

Template.settings.helpers({
  presentation () {
    return Presentations.findOne({ _id: Router.current().params.prez });
  },
  isChecked (value) {
    return (value === true ? 'checked' : '');
  },
  owners () {
    return Template.instance().owners.get();
  },
  users () {
    return Template.instance().users.get();
  },
});

Template.settings.events({
  'click .deletePresentationBtn' (event) {
    event.preventDefault();
    $('.deleteWarningModal').modal({
      onApprove: function() {
        Presentations.remove({ _id: Router.current().params.prez });
        Router.go('home');
      },
    }).modal('show');
  },
  'click .resetViews' (event) {
    event.preventDefault();
    $('.deleteWarningModal').modal({
      onApprove: function() {
        Viewers.update({ _id: Router.current().params.prez }, { $set: { viewers: [] }});
      },
    }).modal('show');
  },
  'click .resetVotes' (event) {
    event.preventDefault();
    $('.deleteWarningModal').modal({
      onApprove: function() {
        Meteor.call('resetVotes', Router.current().params.prez);
      },
    }).modal('show');
  },
  'change #isPublic' (event) {
    if (event.currentTarget.checked) {
      $('#isListedSlider').removeClass('disabled');
    } else {
      $('#isListedSlider').addClass('disabled');
    }
    Presentations.update({ _id: Router.current().params.prez }, { $set: {
      isPublic: event.currentTarget.checked,
    }});
  },
  'change #isListed' (event) {
    Presentations.update({ _id: Router.current().params.prez }, { $set: {
      isListed: event.currentTarget.checked,
    }});
  },
  'change #isLiveOnly' (event) {
    Presentations.update({ _id: Router.current().params.prez }, { $set: {
      isLiveOnly: event.currentTarget.checked,
    }});
  },
  'click .setPrezId' (event) {
    event.preventDefault();
    $('.changePrezIdWarning').modal({
      onApprove: function () {
        let prez = Presentations.findOne({ _id: Router.current().params.prez });
        if (prez) {
          let previousId = prez._id;
          Viewers.remove({ _id: previousId });
          Meteor.call('resetVotes', previousId);
          prez._id = $('#settingsPrezId').val();
          Presentations.insert(prez, function () {
            Presentations.remove({ _id: previousId});
            Viewers.insert({
              _id: prez._id,
              viewers: [],
              left: [],
              right: [],
            });
            $('.changePrezIdWarning').modal('hide');
            Router.go('edit', {prez: prez._id});
          });
        }
      },
      onDeny: function () {
        $('.setPrezId').addClass('disabled');
        $('#settingsPrezId').val(Router.current().params.prez);
      },
    }).modal('show');
  },
  'keyup #settingsPrezId' (event) {
    event.preventDefault();
    if (event.which === 13) {
      if ($('.setPrezId').hasClass('disabled')) {
        return false;
      }
      $('.setPrezId').click();
      return false;
    }
    let prezId = event.currentTarget.value;
    prezId = encodeURIComponent(removeDiacritics(prezId).toLowerCase().replace(/ /g, '-'));
    if (prezId && prezId !== Router.current().params.prez) {
      $('#settingsPrezId').val(prezId);
      $('#settingsPrezIdInput').addClass('loading');
      Meteor.call('checkPrezId', prezId, function (error, result) {
        if (error) {
          error.log(error);
        }
        if (result === true) {
          $('#settingsPrezIdInput > i').addClass('green check').removeClass('red close');
          $('#settingsPrezIdField').removeClass('error');
          $('.setPrezId').removeClass('disabled');
          $('#settingsPrezIdInput').removeClass('loading');
        } else {
          $('#settingsPrezIdInput > i').removeClass('green check').addClass('red close');
          $('#settingsPrezIdField').addClass('error');
          $('.setPrezId').addClass('disabled');
          $('#settingsPrezIdInput').removeClass('loading');
        }
      });
    } else {
      $('.setPrezId').addClass('disabled');
    }
    return false;
  },
  'click .addOwnerBtn' (event) {
    event.preventDefault();
    let email = $('#ownerEmail').val();
    let template = Template.instance();
    if (email && validateEmail(email)) {
      Meteor.call('giveOrwnership', email, Router.current().params.prez, function(error, result) {
        if (result === false) {
          alert('Cant find a user with this address: ' + email);
        } else if (result === true) {
          $('#ownerEmail').val('');
          getOwnersAndUsers(template);
        }
      });
    }
  },
  'click .addUserBtn' (event) {
    event.preventDefault();
    let email = $('#userEmail').val();
    let template = Template.instance();
    if (email && validateEmail(email)) {
      Meteor.call('addUser', email, Router.current().params.prez, function(error, result) {
        if (result === false) {
          alert('Cant find a user with this address: ' + email);
        } else if (result === true) {
          $('#userEmail').val('');
          getOwnersAndUsers(template);
        }
      });
    }
  },
  'click .deleteOwnerBtn' (event) {
    event.preventDefault();
    let ownerId = event.currentTarget.id;
    let template = Template.instance();
    if (ownerId === Meteor.userId()) {
      alert('You can\'t remove yourself');
      return false;
    }
    Meteor.call('removeOwnership', ownerId, Router.current().params.prez);
    getOwnersAndUsers(template);
    return false;
  },
  'click .deleteUserBtn' (event) {
    event.preventDefault();
    let userId = event.currentTarget.id;
    let template = Template.instance();
    Meteor.call('removeUser', userId, Router.current().params.prez);
    getOwnersAndUsers(template);
    return false;
  },
});

Template.settings.onRendered(function () {
  $('.input, .checkbox').popup();
  setTimeout(function () {
    $('.input, .checkbox').popup();
  }, 1000);
});
