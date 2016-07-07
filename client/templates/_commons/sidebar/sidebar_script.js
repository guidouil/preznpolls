Template.sidebar.helpers({
  presentation () {
    return Presentations.findOne({ _id: Router.current().params.prez });
  },
  isActiveSlide (chapterIndex, slideIndex) {
    let prez = Presentations.findOne({ _id: Router.current().params.prez });
    if (prez && prez.chapterViewIndex === chapterIndex && prez.slideViewIndex === slideIndex) {
      return 'primary';
    }
    return '';
  },
  slideIcon (slideType) {
    switch (slideType) {
    default:
    case 'coverSlide':
      return 'header';
    case 'textSlide':
      return 'file text outline';
    case 'imageSlide':
      return 'file image outline';
    case 'videoSlide':
      return 'film';
    case 'pollSlide':
      return 'pie chart';
    }
  },
});

Template.sidebar.events({
  'click .addSlide' (event) {
    event.preventDefault();
    let currentChapterIndex = event.currentTarget.dataset.chapter;
    $('.newSlideType')
    .modal({
      onApprove: function(evt) {
        let prez = Presentations.findOne({ _id: Router.current().params.prez });
        if (prez && prez.chapters.length > 0) {
          let chapters = prez.chapters;
          let currentChapter = chapters[currentChapterIndex];
          currentChapter.slides.push({
            title: prez.title,
            order: currentChapter.slides.length,
            type: evt[0].dataset.ref,
          });
          Presentations.update({ _id: prez._id }, { $set: {
            chapters: chapters,
            slideViewIndex: prez.slideViewIndex + 1,
          }});
          $('.newSlideType').modal('hide');
        }
      },
    })
    .modal('show', function () {
      $('.slideTypeBtn').popup({
        on: 'hover',
      });
    });
  },
  'click .addChapter' () {
    let prez = Presentations.findOne({ _id: Router.current().params.prez });
    if (prez && prez.chapters.length > 0) {
      let chapters = prez.chapters;
      chapters.push({
        order: prez.chapters.length,
        title: 'Chapter ' + prez.chapters.length,
        slides: [{
          title: prez.title,
          order: 0,
          type: 'coverSlide',
        }],
      });
      Presentations.update({ _id: Router.current().params.prez }, { $set: {
        chapterViewIndex: prez.chapters.length,
        slideViewIndex: 0,
        chapters: chapters,
      }});
    }
  },
  'click .sidebarSlide' (event) {
    let prez = Presentations.findOne({ _id: Router.current().params.prez });
    let flip = 'ping';
    if (prez.flip === flip) {
      flip = 'pong';
    }
    Presentations.update({ _id: Router.current().params.prez }, { $set: {
      chapterViewIndex: event.currentTarget.dataset.chapter,
      slideViewIndex: event.currentTarget.dataset.index,
      flip: flip,
    }});
  },
  'click .deleteSlideBtn' (event) {
    event.preventDefault();
    let prez = Presentations.findOne({ _id: Router.current().params.prez });
    if (prez) {
      let currentSlideIndex = event.currentTarget.dataset.index;
      let currentChapterIndex = event.currentTarget.dataset.chapter;
      let chapters = prez.chapters;
      chapters[currentChapterIndex].slides.splice(currentSlideIndex, 1);
      Presentations.update({ _id: Router.current().params.prez }, { $set: {
        chapterViewIndex: currentChapterIndex,
        slideViewIndex: 0,
        chapters: chapters,
      }});
    }
  },
});

Template.sidebar.onRendered(function () {
  makeEditable();
});
