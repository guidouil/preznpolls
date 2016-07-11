Template.settings.onCreated(function () {
  this.subscribe('Presentation', Router.current().params.prez);
});

Template.settings.helpers({
  presentation () {
    return Presentations.findOne({ _id: Router.current().params.prez });
  },
  isChecked (value) {
    return (value === true ? 'checked' : '');
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
            $('.changePrezIdWarning').modal('hide');
            Router.go('edit', {prez: prez._id});
          });
        }
      },
      onDeny: function () {
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
    prezId = removeDiacritics(prezId).toLowerCase().replace(/ /g, '-');
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
});

Template.settings.onRendered(function () {
});
