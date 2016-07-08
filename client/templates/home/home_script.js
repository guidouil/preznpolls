Template.home.helpers({
  presentations () {
    return Presentations.find({}, {sort: {name: 1}}).fetch();
  },
  chaptersCount () {
    let chaptersCount = 0;
    if (this.chapters && this.chapters.length) {
      chaptersCount = this.chapters.length;
    }
    return chaptersCount;
  },
  slidesCount () {
    let slidesCount = 0;
    if (this.chapters && this.chapters.length) {
      _.each(this.chapters, function (chapter) {
        if (chapter.slides && chapter.slides.length) {
          slidesCount += chapter.slides.length;
        }
      });
    }
    return slidesCount;
  },
});

Template.home.events({
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

Template.home.onRendered(function () {
  this.subscribe('Presentations');
  $('#prezTitle').keypress(function (e) {
    if (e.which === 13) {
      $('.createPrezBtn').click();
      return false;
    }
  });
});
