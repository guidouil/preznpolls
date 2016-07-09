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
          Viewers.insert({ _id: prezId, viewers: []});
        }
      },
    }).modal('show');
  },
});

Template.header.onRendered(function () {
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
  }, 20000);

  $('#prezTitle').keypress(function (e) {
    if (e.which === 13) {
      $('.createPrezBtn').click();
      return false;
    }
  });
});
