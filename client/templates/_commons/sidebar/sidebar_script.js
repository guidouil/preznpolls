Template.sidebar.helpers({
  presentation () {
    return Presentations.findOne({ _id: Router.current().params.prez });
  },
  isActiveSlide (chapterIndex, slideIndex) {
    let prez = Presentations.findOne({ _id: Router.current().params.prez });
    if (prez && prez.chapterViewIndex === chapterIndex && prez.slideViewIndex === slideIndex) {
      return 'inverted';
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
  slideColor (slideType) {
    switch (slideType) {
    default:
    case 'coverSlide':
      return 'green';
    case 'textSlide':
      return 'teal';
    case 'imageSlide':
      return 'orange';
    case 'videoSlide':
      return 'red';
    case 'pollSlide':
      return 'blue';
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
            color: 'basic',
            image: '/default-image.png',
            video: 'https://www.youtube.com/embed/O6Xo21L0ybE',
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
          color: 'basic',
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
      $('.deleteWarningModal').modal({
        onApprove: function() {
          chapters[currentChapterIndex].slides.splice(currentSlideIndex, 1);
          Presentations.update({ _id: Router.current().params.prez }, { $set: {
            chapterViewIndex: currentChapterIndex,
            slideViewIndex: 0,
            chapters: chapters,
          }});
        },
      }).modal('show');
    }
  },
  'click .deleteChapterBtn' (event) {
    let prez = Presentations.findOne({ _id: Router.current().params.prez });
    if (prez) {
      let currentChapterIndex = event.currentTarget.dataset.index;
      let chapters = prez.chapters;
      $('.deleteWarningModal').modal({
        onApprove: function() {
          chapters.splice(currentChapterIndex, 1);
          _.each(chapters, function( chapter, index) {
            chapter.order = index;
          });
          Presentations.update({ _id: Router.current().params.prez }, { $set: {
            chapterViewIndex: 0,
            slideViewIndex: 0,
            chapters: chapters,
          }});
        },
      }).modal('show');
    }
  },
  'click .deletePresentationBtn' () {
    $('.deleteWarningModal').modal({
      onApprove: function() {
        Presentations.remove({ _id: Router.current().params.prez });
        $('.presentationSidebar').sidebar('hide');
        Router.go('home');
      },
    }).modal('show');
  },
  'click .resetViews' () {
    $('.deleteWarningModal').modal({
      onApprove: function() {
        Viewers.update({ _id: Router.current().params.prez }, { $set: { viewers: [] }});
        $('.presentationSidebar').sidebar('hide');
      },
    }).modal('show');
  },
  'click .resetVotes' () {
    $('.deleteWarningModal').modal({
      onApprove: function() {
        Meteor.call('resetVotes', Router.current().params.prez);
        $('.presentationSidebar').sidebar('hide');
      },
    }).modal('show');
  },
});

Template.sidebar.onRendered(function () {
  makeEditable();
});
