Template.view.onCreated(function () {
  this.subscribe('Presentation', Router.current().params.prez);
  this.subscribe('Viewers', Router.current().params.prez);
  this.subscribe('Votes', Router.current().params.prez);
  Viewers.update({ _id: Router.current().params.prez }, { $addToSet: { viewers: Meteor.userId() }});
  this.flip = new ReactiveVar('ping');
});

Template.view.helpers({
  prezId () {
    return Router.current().params.prez;
  },
  slide () {
    let prez = Presentations.findOne({ _id: Router.current().params.prez });
    if (prez && prez.chapters) {
      let slide = prez.chapters[Router.current().params.chapter].slides[Router.current().params.slide];
      slide.chapterIndex = Router.current().params.chapter;
      slide.slideIndex = Router.current().params.slide;
      return slide;
    }
    return false;
  },
  flip () {
    return Template.instance().flip.get();
  },
  chapterPosition () {
    let prez = Presentations.findOne({ _id: Router.current().params.prez });
    if (prez && prez.chapters && prez.chapters.length > 1) {
      return Number(Router.current().params.chapter) + 1;
    }
    return false;
  },
  slidePagination () {
    let prez = Presentations.findOne({ _id: Router.current().params.prez });
    if (prez) {
      return (Number(Router.current().params.slide) + 1) + '/' + prez.chapters[Router.current().params.chapter].slides.length;
    }
    return '';
  },
});

Template.view.events({
  'click .previousSlide' () {
    let prez = Presentations.findOne({ _id: Router.current().params.prez });
    if (prez && Number(Router.current().params.chapter) >= 0 && Number(Router.current().params.slide) >= 0) {
      let flip = 'ping';
      if (Template.instance().flip.get() === flip) {
        flip = 'pong';
      }
      if (Number(Router.current().params.slide) === 0) { // first slide of chapter
        if (Number(Router.current().params.chapter) === 0) { // first chapter ?
          Template.instance().flip.set(flip);
          Router.go('view', {prez: prez._id, chapter: prez.chapters.length - 1, slide: prez.chapters[prez.chapters.length - 1].slides.length - 1});
        } else { // other chapters
          Template.instance().flip.set(flip);
          Router.go('view', {prez: prez._id, chapter: Number(Router.current().params.chapter) - 1, slide: prez.chapters[Number(Router.current().params.chapter) - 1].slides.length - 1});
        }
      } else { // regular previous slide in current chapter
        Template.instance().flip.set(flip);
        Router.go('view', {prez: prez._id, chapter: Number(Router.current().params.chapter), slide: Number(Router.current().params.slide) - 1});
      }
    }
  },
  'click .nextSlide' () {
    let prez = Presentations.findOne({ _id: Router.current().params.prez });
    if (prez && Number(Router.current().params.chapter) >= 0 && Number(Router.current().params.slide) >= 0) {
      let flip = 'ping';
      if (Template.instance().flip.get() === flip) {
        flip = 'pong';
      }
      if (Number(Router.current().params.slide) === prez.chapters[Number(Router.current().params.chapter)].slides.length - 1) { // last slide of chapter
        if (Number(Router.current().params.chapter) === prez.chapters.length - 1) { // last chapter ?
          Template.instance().flip.set(flip);
          Router.go('view', {prez: prez._id, chapter: 0, slide: 0});
        } else { // other chapters
          Template.instance().flip.set(flip);
          Router.go('view', {prez: prez._id, chapter: Number(Router.current().params.chapter) + 1, slide: 0});
        }
      } else { // regular next slide in current chapter
        Template.instance().flip.set(flip);
        Router.go('view', {prez: prez._id, chapter: Number(Router.current().params.chapter), slide: Number(Router.current().params.slide) + 1});
      }
    }
  },
});

Template.view.onRendered(function () {
});
