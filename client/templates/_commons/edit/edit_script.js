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
    if (prez && prezIndex && prezIndex.chapterViewIndex >= 0 && prezIndex.slideViewIndex >= 0 && prez.chapters && prez.chapters[prezIndex.chapterViewIndex] && prez.chapters[prezIndex.chapterViewIndex].slides) {
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

Template.edit.events({
  'click .editImageBtn' (event) {
    Session.set('imageField', event.currentTarget.dataset.field);
    $('.mediaSidebar')
    .sidebar({
      transition: 'scale down',
      onVisible: function () {
        $('.mediaTabs .item').tab();
      },
    }).sidebar('show');
  },
  'click .previousSlide' () {
    let prez = Presentations.findOne({ _id: Router.current().params.prez });
    let prezIndex = PrezIndexes.findOne({ _id: Router.current().params.prez });
    if (prez && prezIndex.chapterViewIndex >= 0 && prezIndex.slideViewIndex >= 0) {
      Viewers.update({ _id: Router.current().params.prez }, { $unset: { left: '', right: '' }});
      let flip = 'ping';
      if (prezIndex.flip === flip) {
        flip = 'pong';
      }
      if (prezIndex.slideViewIndex === 0) { // first slide of chapter
        if (prezIndex.chapterViewIndex === 0) { // first chapter ?
          PrezIndexes.update({ _id: prez._id }, {
            $set: {
              chapterViewIndex: prez.chapters.length - 1,
              slideViewIndex: prez.chapters[prez.chapters.length - 1].slides.length - 1,
              flip: flip,
            },
          });
        } else { // other chapters
          PrezIndexes.update({ _id: prez._id }, {
            $set: {
              chapterViewIndex: prezIndex.chapterViewIndex - 1,
              slideViewIndex: prez.chapters[prezIndex.chapterViewIndex - 1].slides.length - 1,
              flip: flip,
            },
          });
        }
      } else { // regular previous slide in current chapter
        PrezIndexes.update({ _id: Router.current().params.prez }, {
          $inc: { slideViewIndex: -1 },
          $set: { flip: flip },
        });
      }
    }
  },
  'click .nextSlide' () {
    let prez = Presentations.findOne({ _id: Router.current().params.prez });
    let prezIndex = PrezIndexes.findOne({ _id: Router.current().params.prez });
    if (prez && prezIndex.chapterViewIndex >= 0 && prezIndex.slideViewIndex >= 0) {
      Viewers.update({ _id: Router.current().params.prez }, { $unset: { right: '', left: '' }});
      let flip = 'ping';
      if (prezIndex.flip === flip) {
        flip = 'pong';
      }
      if (prezIndex.slideViewIndex === prez.chapters[prezIndex.chapterViewIndex].slides.length - 1) { // last slide of chapter
        if (prezIndex.chapterViewIndex === prez.chapters.length - 1) { // last chapter ?
          PrezIndexes.update({ _id: prez._id }, {
            $set: {
              chapterViewIndex: 0,
              slideViewIndex: 0,
              flip: flip,
            },
          });
        } else { // other chapters
          PrezIndexes.update({ _id: prez._id }, {
            $set: {
              chapterViewIndex: prezIndex.chapterViewIndex + 1,
              slideViewIndex: 0,
              flip: flip,
            },
          });
        }
      } else { // regular next slide in current chapter
        PrezIndexes.update({ _id: Router.current().params.prez }, {
          $inc: { slideViewIndex: 1 },
          $set: { flip: flip },
        });
      }
    }
  },
});

Template.edit.onRendered(function () {
  $('.presentationSidebar')
  .sidebar('setting', 'transition', 'scale down')
  .sidebar('show');
});
