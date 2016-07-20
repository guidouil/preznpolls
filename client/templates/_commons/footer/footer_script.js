Template.footer.helpers({
  prez () {
    return Router.current().params.prez;
  },
  isPollSlide () {
    let prez = Presentations.findOne({ _id: Router.current().params.prez });
    let prezIndex = PrezIndexes.findOne({ _id: Router.current().params.prez });
    if (prez && prezIndex && prezIndex.chapterViewIndex >= 0 && prezIndex.slideViewIndex >= 0 && prez.chapters && prez.chapters[prezIndex.chapterViewIndex]) {
      return prez.chapters[prezIndex.chapterViewIndex].slides[prezIndex.slideViewIndex].type === 'pollSlide';
    }
    return false;
  },
  activeStat () {
    if (Session.equals('showMeTheStat', true)) {
      return 'green';
    }
    return '';
  },
  voters () {
    let voters = 0;
    let prez = Presentations.findOne({ _id: Router.current().params.prez });
    let prezIndex = PrezIndexes.findOne({ _id: Router.current().params.prez });
    if (prez && prezIndex && prez.chapters[prezIndex.chapterViewIndex].slides[prezIndex.slideViewIndex].questions) {
      let questions = prez.chapters[prezIndex.chapterViewIndex].slides[prezIndex.slideViewIndex].questions;
      _.each(questions, function (question) {
        let query = {};
        query[Router.current().params.prez + '.' + question.questionId] = {$exists: 1};
        voters += Votes.find(query).count();
      });
    }
    return voters;
  },
  viewersWant () {
    let viewersWant = {};
    if (Router.current().params.prez) {
      let viewers = Viewers.findOne({ _id: Router.current().params.prez });
      if (viewers && viewers.left ) {
        viewersWant.left = viewers.left.length;
      }
      if (viewers && viewers.right ) {
        viewersWant.right = viewers.right.length;
      }
    }
    return viewersWant;
  },
});

Template.footer.events({
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
  'click .viewStat' () {
    if (Session.equals('showMeTheStat', true)) {
      Session.set('showMeTheStat', false);
    } else {
      Session.set('showMeTheStat', true);
    }
  },
});

Template.footer.onRendered(function () {
});
