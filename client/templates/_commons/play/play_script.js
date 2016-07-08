Template.play.onCreated(function () {
  this.subscribe('Presentation', Router.current().params.prez);
  this.subscribe('Viewers', Router.current().params.prez);
  this.subscribe('Votes', Router.current().params.prez);
  Viewers.update({ _id: Router.current().params.prez }, { $addToSet: { viewers: Meteor.userId() }});
});

Template.play.helpers({
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
  flip () {
    let prez = Presentations.findOne({ _id: Router.current().params.prez });
    if (prez) {
      return prez.flip;
    }
    return false;
  },
});

Template.play.onDestroyed(function () {
  Viewers.update({ _id: Router.current().params.prez }, { $pull: { viewers: Meteor.userId() }});
});
