Template.play.onCreated(function () {
  this.subscribe('Presentation', Router.current().params.prez);
  this.subscribe('PrezIndex', Router.current().params.prez);
  this.subscribe('Viewers', Router.current().params.prez);
  this.subscribe('Votes', Router.current().params.prez);
  this.subscribe('Images');
  Viewers.update({ _id: Router.current().params.prez }, { $addToSet: { viewers: Meteor.userId() }});
  Meteor.call('addPrezViewer', Router.current().params.prez);
});

Template.play.helpers({
  slide () {
    let prez = Presentations.findOne({ _id: Router.current().params.prez });
    let prezIndex = PrezIndexes.findOne({ _id: Router.current().params.prez });
    if (prez && prezIndex && prezIndex.chapterViewIndex >= 0 && prezIndex.slideViewIndex >= 0) {
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
  chapterPosition () {
    let prez = Presentations.findOne({ _id: Router.current().params.prez });
    let prezIndex = PrezIndexes.findOne({ _id: Router.current().params.prez });
    if (prez && prez.chapters.length > 1 && prezIndex && prezIndex.chapterViewIndex >= 0) {
      return prezIndex.chapterViewIndex + 1;
    }
    return false;
  },
  slidePagination () {
    let prez = Presentations.findOne({ _id: Router.current().params.prez });
    let prezIndex = PrezIndexes.findOne({ _id: Router.current().params.prez });
    if (prez && prezIndex && prezIndex.chapterViewIndex >= 0 && prezIndex.slideViewIndex >= 0) {
      return (prezIndex.slideViewIndex + 1) + '/' + prez.chapters[prezIndex.chapterViewIndex].slides.length;
    }
    return '';
  },
});

Template.play.events({
  'click .viewLeft' () {
    let prez = Presentations.findOne({ _id: Router.current().params.prez });
    let prezIndex = PrezIndexes.findOne({ _id: Router.current().params.prez });
    if (prez && prezIndex && ! prez.isLiveOnly) {
      Router.go('view', {prez: prez._id, chapter: prezIndex.chapterViewIndex, slide: prezIndex.slideViewIndex});
    } else {
      Viewers.update({ _id: Router.current().params.prez }, { $addToSet: { left: Meteor.userId() }});
      $('.viewLeft').addClass('loading');
    }
  },
  'click .viewRight' () {
    let prez = Presentations.findOne({ _id: Router.current().params.prez });
    let prezIndex = PrezIndexes.findOne({ _id: Router.current().params.prez });
    if (prez && ! prez.isLiveOnly) {
      Router.go('view', {prez: prez._id, chapter: prezIndex.chapterViewIndex, slide: prezIndex.slideViewIndex});
    } else {
      Viewers.update({ _id: Router.current().params.prez }, { $addToSet: { right: Meteor.userId() }});
      $('.viewRight').addClass('loading');
    }
  },
});

Template.play.onDestroyed(function () {
  Viewers.update({ _id: Router.current().params.prez }, { $pull: { viewers: Meteor.userId() }});
});

Template.ping.onRendered(function () {
  $('.viewLeft').removeClass('loading');
  $('.viewRight').removeClass('loading');
});

Template.pong.onRendered(function () {
  $('.viewLeft').removeClass('loading');
  $('.viewRight').removeClass('loading');
});
