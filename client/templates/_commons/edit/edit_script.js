Template.edit.onCreated(function () {
  this.subscribe('Presentation', Router.current().params.prez);
  this.subscribe('PrezIndex', Router.current().params.prez);
  this.subscribe('Viewers', Router.current().params.prez);
  this.subscribe('Votes', Router.current().params.prez);
});

Template.edit.helpers({
  prezId () {
    return Router.current().params.prez;
  },
  presentation () {
    return Presentations.findOne({ _id: Router.current().params.prez });
  },
  slide () {
    let prez = Presentations.findOne({ _id: Router.current().params.prez });
    let prezIndex = PrezIndexes.findOne({ _id: Router.current().params.prez });
    if (prez && prezIndex.chapterViewIndex >= 0 && prezIndex.slideViewIndex >= 0 && prez.chapters && prez.chapters[prezIndex.chapterViewIndex] && prez.chapters[prezIndex.chapterViewIndex].slides) {
      let slide = prez.chapters[prezIndex.chapterViewIndex].slides[prezIndex.slideViewIndex];
      slide.chapterIndex = prezIndex.chapterViewIndex;
      slide.slideIndex = prezIndex.slideViewIndex;
      return slide;
    }
    return false;
  },
  flip () {
    let prezIndex = PrezIndexes.findOne({ _id: Router.current().params.prez });
    if (prezIndex) {
      return prezIndex.flip;
    }
    return false;
  },
});

Template.edit.events({

});

Template.edit.onRendered(function () {
  $('.presentationSidebar')
  .sidebar('setting', 'transition', 'scale down')
  .sidebar('show');
});
