Template.home.helpers({
  presentations () {
    return Presentations.find({}, {sort: {name: 1}}).fetch();
  },
});

Template.home.events({
  'click .createPrez' () {
    $('.prezTitleModal').modal({
      onApprove: function() {
        let prezTitle = $('#prezTitle').val();
        let prez = Presentations.insert({
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
        Router.go('edit', {'prez': prez});
      },
    }).modal('show');
  },
});

Template.home.onRendered(function () {
  $('#prezTitle').keypress(function (e) {
    if (e.which === 13) {
      $('.createPrezBtn').click();
      return false;
    }
  });
});
