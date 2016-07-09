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
});

Template.header.events({
  'click .createPrez' () {
    $('.prezTitleModal').modal({
      onApprove: function() {
        let prezTitle = $('#prezTitle').val();
        if (prezTitle) {
          let prezId = Presentations.insert({
            title: prezTitle,
            chapters: [{
              order: 0,
              title: 'Chapter 0',
              slides: [{
                order: 0,
                type: 'coverSlide',
                title: prezTitle,
                color: 'basic',
              }],
            }],
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
});

Template.header.onRendered(function () {
  $('.dropdown').dropdown();
  $('.createPrez').transition('tada');
  Meteor.setInterval(function () {
    let yaya = Math.random();
    if (yaya >= 0.75) {
      $('.createPrez').transition('tada');
    } else if (yaya >= 0.5) {
      $('.createPrez').transition('jiggle');
    } else if (yaya >= 0.25) {
      $('.createPrez').transition('flash');
    } else {
      $('.createPrez').transition('pulse').transition('pulse');
    }
  }, 10000);

  $('#prezTitle').keypress(function (e) {
    if (e.which === 13) {
      $('.createPrezBtn').click();
      return false;
    }
  });
});
