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
  isChecked (value) {
    return (value === true ? 'checked' : '');
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
            image: '/default-image.jpeg',
            video: 'https://www.youtube.com/embed/O6Xo21L0ybE',
            questions: [{
              questionId: Random.id(),
              text: 'What is the question?',
              type: 'singleChoiceQuestion',
              stat: 'pieStat',
              order: 0,
              description: '',
              help: '',
              answers: [{
                answerId: Random.id(),
                text: 'Answer 1',
                minValue: 0,
                maxValue: 5,
                order: 0,
                value: 1,
                isRightAnswer: false,
              }],
            }],
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
    $('.presentationSidebar').sidebar('hide');
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
  'change #isPublic' (evt) {
    Presentations.update({ _id: Router.current().params.prez }, { $set: {
      isPublic: evt.currentTarget.checked,
    }});
  },
  'change #isListed' (evt) {
    Presentations.update({ _id: Router.current().params.prez }, { $set: {
      isListed: evt.currentTarget.checked,
    }});
  },
  'change #isLiveOnly' (evt) {
    Presentations.update({ _id: Router.current().params.prez }, { $set: {
      isLiveOnly: evt.currentTarget.checked,
    }});
  },
});

Template.sidebar.onRendered(function () {
  makeEditable();
});
