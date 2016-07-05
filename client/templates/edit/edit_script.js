Template.edit.helpers({
  presentation () {
    return Presentations.findOne({ _id: Router.current().params.prez });
  },
  slide () {
    let prez = Presentations.findOne({ _id: Router.current().params.prez });
    if (prez && prez.chapterViewIndex >= 0 && prez.slideViewIndex >= 0) {
      let slide = prez.chapters[prez.chapterViewIndex].slides[prez.slideViewIndex];
      slide.chapterIndex = prez.chapterViewIndex;
      slide.slideIndex = prez.slideViewIndex;
      return slide;
    }
    return false;
  },
});

Template.edit.events({
  'click .showPrezSidebar' () {
    $('.presentationSidebar')
    .sidebar('setting', 'transition', 'scale down')
    .sidebar('show');
  },
});

Template.edit.onRendered(function () {

});
