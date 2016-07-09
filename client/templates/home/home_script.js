Template.home.helpers({
  presentations () {
    return Presentations.find({ isPublic: true, isListed: true }, {sort: {createdAt: -1}}).fetch();
  },
  myPresentations () {
    if (Meteor.userId()) {
      return Presentations.find({ owners: Meteor.userId() }, {sort: {createdAt: -1}}).fetch();
    }
    return false;
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
  viewersCount () {
    let viewersCount = 0;
    if (this && this.viewers) {
      viewersCount = this.viewers.length;
    }
    return viewersCount;
  },
});

Template.home.events({

});

Template.home.onRendered(function () {
  this.subscribe('Presentations');
});
