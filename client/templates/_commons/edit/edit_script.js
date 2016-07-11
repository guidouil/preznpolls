Template.edit.onCreated(function () {
  this.subscribe('Presentation', Router.current().params.prez);
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
    if (prez && prez.chapterViewIndex >= 0 && prez.slideViewIndex >= 0 && prez.chapters && prez.chapters[prez.chapterViewIndex] && prez.chapters[prez.chapterViewIndex].slides) {
      let slide = prez.chapters[prez.chapterViewIndex].slides[prez.slideViewIndex];
      slide.chapterIndex = prez.chapterViewIndex;
      slide.slideIndex = prez.slideViewIndex;
      return slide;
    }
    return false;
  },
  flip () {
    let prez = Presentations.findOne({ _id: Router.current().params.prez });
    if (prez) {
      return prez.flip;
    }
    return false;
  },
});

Template.edit.events({
  
});

Template.edit.onRendered(function () {

});
