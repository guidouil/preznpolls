Template.footer.helpers({
  prez () {
    return Router.current().params.prez;
  },
});

Template.footer.events({
  'click .previousSlide' () {
    let prez = Presentations.findOne({ _id: Router.current().params.prez });
    if (prez && prez.chapterViewIndex >= 0 && prez.slideViewIndex >= 0) {
      if (prez.slideViewIndex === 0) { // first slide of chapter
        if (prez.chapterViewIndex === 0) { // first chapter ?
          Presentations.update({ _id: prez._id }, {
            $set: {
              chapterViewIndex: prez.chapters.length - 1,
              slideViewIndex: prez.chapters[prez.chapters.length - 1].slides.length - 1,
            },
          });
        } else { // other chapters
          Presentations.update({ _id: prez._id }, {
            $set: {
              chapterViewIndex: prez.chapterViewIndex - 1,
              slideViewIndex: prez.chapters[prez.chapterViewIndex - 1].slides.length - 1,
            },
          });
        }
      } else { // regular previous slide in current chapter
        Presentations.update({ _id: Router.current().params.prez }, {
          $inc: { slideViewIndex: -1 },
        });
      }
    }
  },
  'click .nextSlide' () {
    let prez = Presentations.findOne({ _id: Router.current().params.prez });
    if (prez && prez.chapterViewIndex >= 0 && prez.slideViewIndex >= 0) {
      if (prez.slideViewIndex === prez.chapters[prez.chapterViewIndex].slides.length - 1) { // last slide of chapter
        if (prez.chapterViewIndex === prez.chapters.length - 1) { // last chapter ?
          Presentations.update({ _id: prez._id }, {
            $set: {
              chapterViewIndex: 0,
              slideViewIndex: 0,
            },
          });
        } else { // other chapters
          Presentations.update({ _id: prez._id }, {
            $set: {
              chapterViewIndex: prez.chapterViewIndex + 1,
              slideViewIndex: 0,
            },
          });
        }
      } else { // regular next slide in current chapter
        Presentations.update({ _id: Router.current().params.prez }, {
          $inc: { slideViewIndex: 1 },
        });
      }
    }
  },
  'click .viewStat' () {
    if (Session.equals('showMeTheStat', true)) {
      Session.set('showMeTheStat', false);
    } else {
      Session.set('showMeTheStat', true);
    }
  }
});

Template.footer.onRendered(function () {
});
