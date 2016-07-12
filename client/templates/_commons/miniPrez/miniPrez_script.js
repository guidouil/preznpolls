Template.miniPrez.helpers({
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
  viewersCount () {
    let viewersCount = 0;
    if (this && this.viewers) {
      viewersCount = this.viewers.length;
    }
    return viewersCount;
  },
});

Template.miniPrez.events({
  'click .miniPrez' () {
    Router.go('play', {prez: this._id});
  },
});

Template.miniPrez.onRendered(function () {

});
