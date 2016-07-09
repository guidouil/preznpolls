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

});

Template.home.onRendered(function () {
  this.subscribe('Presentations');
});
