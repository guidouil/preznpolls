Template.play.onCreated(function () {
  this.subscribe('Presentation', Router.current().params.prez);
  this.subscribe('Viewers', Router.current().params.prez);
  this.subscribe('Votes', Router.current().params.prez);
  Viewers.update({ _id: Router.current().params.prez }, { $addToSet: { viewers: Meteor.userId() }});
  Meteor.call('addPrezViewer', Router.current().params.prez);
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
  chapterPosition () {
    let prez = Presentations.findOne({ _id: Router.current().params.prez });
    if (prez && prez.chapters && prez.chapters.length > 1) {
      return prez.chapterViewIndex + 1;
    }
    return false;
  },
  slidePagination () {
    let prez = Presentations.findOne({ _id: Router.current().params.prez });
    if (prez && prez.chapterViewIndex >= 0 && prez.slideViewIndex >= 0) {
      return (prez.slideViewIndex + 1) + '/' + prez.chapters[prez.chapterViewIndex].slides.length;
    }
    return '';
  },
  prezUrl () {
    return Meteor.absoluteUrl('p/' + Router.current().params.prez);
  },
});

Template.play.events({
  'click .viewLeft' () {
    let prez = Presentations.findOne({ _id: Router.current().params.prez });
    if (prez && ! prez.isLiveOnly) {
      Router.go('view', {prez: prez._id, chapter: prez.chapterViewIndex, slide: prez.slideViewIndex});
    } else {
      Viewers.update({ _id: Router.current().params.prez }, { $addToSet: { left: Meteor.userId() }});
      $('.viewLeft').addClass('loading');
    }
  },
  'click .viewRight' () {
    let prez = Presentations.findOne({ _id: Router.current().params.prez });
    if (prez && ! prez.isLiveOnly) {
      Router.go('view', {prez: prez._id, chapter: prez.chapterViewIndex, slide: prez.slideViewIndex});
    } else {
      Viewers.update({ _id: Router.current().params.prez }, { $addToSet: { right: Meteor.userId() }});
      $('.viewRight').addClass('loading');
    }
  },
  'click .showUrl' () {
    $('.prezUrlModal').modal({
      dimmerSettings: {
        opacity: 1,
      },
    }).modal('show');
  },
});

Template.play.onDestroyed(function () {
  Viewers.update({ _id: Router.current().params.prez }, { $pull: { viewers: Meteor.userId() }});
});
