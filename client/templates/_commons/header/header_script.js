Template.header.helpers({
  isHome () {
    return Router.current().route.getName() === 'home';
  },
  prezTitle () {
    if (Router.current().params.prez) {
      let prez = Presentations.findOne({ _id: Router.current().params.prez });
      if (prez) {
        return prez.title;
      }
    }
    return false;
  },
  viewers () {
    if (Router.current().params.prez) {
      let viewers = Viewers.findOne({ _id: Router.current().params.prez });
      if (viewers && viewers.viewers ) {
        return viewers.viewers.length;
      }
    }
    return 0;
  },
  userName() {
    if (Meteor.user()) {
      let email = contactEmail(Meteor.user());
      let piece = email.split('@');
      return piece[0];
    }
    return '';
  },
  prez () {
    return Router.current().params.prez;
  },
  prezUrl () {
    return 'prez.win/' + Router.current().params.prez;
  },
  messagesCount () {
    let discussion = Discussions.findOne({ _id: Router.current().params.prez });
    if (discussion && discussion.discussion) {
      return discussion.discussion.length;
    }
    return false;
  },
});

Template.header.events({
  'click .createPrez' () {
    $('.prezTitleModal').modal({
      onVisible: function () {
        $('#prezIdInput').popup();
      },
      onApprove: function() {
        let prezId = $('#prezId').val();
        let prezTitle = $('#prezTitle').val();
        if (prezId && prezTitle) {
          Presentations.insert({
            _id: prezId,
            title: prezTitle,
            chapters: [{
              order: 0,
              title: 'Chapter 1',
              slides: [{
                order: 0,
                type: 'coverSlide',
                title: prezTitle + ', chapter 1',
                color: 'basic',
              }],
            }],
          });
          PrezIndexes.insert({
            _id: prezId,
          });
          Viewers.insert({
            _id: prezId,
            viewers: [],
            left: [],
            right: [],
          });
          $('#prezTitle').val('');
          $('.prezTitleModal').modal('hide');
          Router.go('play', {prez: prezId});
        }
        return true;
      },
    }).modal('show');
  },
  'click .signOutBtn' () {
    Meteor.logout(function () {
      Router.go('home');
    });
  },
  'click .showUrl' () {
    $('.prezUrlModal').modal({
      dimmerSettings: {
        opacity: 1,
      },
    }).modal('show');
  },
  'click .showPrezSidebar' () {
    $('.presentationSidebar')
    .sidebar({
      transition: 'scale down',
      onVisible: function () {
        $('.dropdown').dropdown({
          direction: 'upward',
        });
      },
    }).sidebar('show');
  },
  'click .showPlaySidebar' () {
    $('.playSidebar').sidebar({
      transition: 'overlay',
      dimPage: false,
      onVisible: function () {
        $('.chatContent').scrollTop($(document).height());
        $('#messageInput').focus();
      },
    }).sidebar('show');
  },
});

Template.header.onRendered(function () {
  $('.dropdown').dropdown();
  $('.item').popup();
  // cool animations for the + top left icon
  $('.createPrezIcon').addClass('loading');
  setTimeout(function () {
    $('.createPrezIcon').removeClass('loading');
  }, 500);
  Meteor.setInterval(function () {
    let yaya = Math.random();
    if (yaya >= 0.75) {
      $('.createPrez').transition('tada');
    } else if (yaya >= 0.5) {
      $('.createPrez').transition('jiggle');
    } else if (yaya >= 0.25) {
      $('.createPrez').transition('pulse');
    } else {
      $('.createPrezIcon').addClass('loading');
      setTimeout(function () {
        $('.createPrezIcon').removeClass('loading');
      }, 500);
    }
  }, 10000);

  $('#prezTitle').keyup(function (event) {
    if (event.which === 13) {
      if ($('.createPrezBtn').hasClass('disabled')) {
        return false;
      }
      $('.createPrezBtn').click();
      return false;
    }
    let prezTitle = event.currentTarget.value;
    let prezId = encodeURIComponent(removeDiacritics(prezTitle).toLowerCase().replace(/ /g, '-'));
    $('#prezId').val(prezId);
    $('#prezIdInput').addClass('loading');
    Meteor.call('checkPrezId', prezId, function (error, result) {
      if (error) {
        error.log(error);
      }
      if (result === true) {
        $('#prezIdInput > i').addClass('green check').removeClass('red close');
        $('#prezIdField').removeClass('error');
        $('.createPrezBtn').removeClass('disabled');
        $('#prezIdInput').removeClass('loading');
      } else {
        $('#prezIdInput > i').removeClass('green check').addClass('red close');
        $('#prezIdField').addClass('error');
        $('.createPrezBtn').addClass('disabled');
        $('#prezIdInput').removeClass('loading');
      }
    });
    return false;
  });
  $('#prezId').keyup(function (event) {
    if (event.which === 13) {
      if ($('.createPrezBtn').hasClass('disabled')) {
        return false;
      }
      $('.createPrezBtn').click();
      return false;
    }
    let prezId = event.currentTarget.value;
    prezId = encodeURIComponent(removeDiacritics(prezId).toLowerCase().replace(/ /g, '-'));
    if (prezId) {
      $('#prezId').val(prezId);
      $('#prezIdInput').addClass('loading');
      Meteor.call('checkPrezId', prezId, function (error, result) {
        if (error) {
          error.log(error);
        }
        if (result === true) {
          $('#prezIdInput > i').addClass('green check').removeClass('red close');
          $('#prezIdField').removeClass('error');
          $('.createPrezBtn').removeClass('disabled');
          $('#prezIdInput').removeClass('loading');
        } else {
          $('#prezIdInput > i').removeClass('green check').addClass('red close');
          $('#prezIdField').addClass('error');
          $('.createPrezBtn').addClass('disabled');
          $('#prezIdInput').removeClass('loading');
        }
      });
    }
    $('#prezIdInput > i').removeClass('green check').addClass('red close');
    $('#prezIdField').addClass('error');
    $('.createPrezBtn').addClass('disabled');
    $('#prezIdInput').removeClass('loading');
    return false;
  });
});
