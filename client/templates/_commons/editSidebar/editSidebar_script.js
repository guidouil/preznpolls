Template.editSidebar.onRendered(function () {
  makeEditable();
  $('.button, .link').popup();
  let container = document.getElementById('slidesBtnCOntainer');
  let sort = Sortable.create(container, {
    animation: 150, // ms, animation speed moving items when sorting, `0` — without animation
    handle: '.slideSideBtns', // Restricts sort start click/touch to the specified element
    draggable: '.buttons', // Specifies which items inside the element should be sortable
    onUpdate: function (evt) {
      let item = evt.item; // the current dragged HTMLElement
      let prez = Presentations.findOne({ _id: Router.current().params.prez });
      if (prez) {
        let slides = prez.chapters[item.dataset.chapter].slides;
        let oldIndex = evt.oldIndex;
        let newIndex = evt.newIndex;
        if (oldIndex !== newIndex && slides) {
          let newSlides = [];
          _.each(slides, function(slide, index) {
            if ((index < oldIndex && index !== newIndex) || (index < newIndex && index !== oldIndex)) {
              newSlides.push(slide);
            } else if (index === newIndex) {
              if (newIndex > oldIndex) {
                // current slide pushed before
                newSlides.push(slide);
                // moved slide
                newSlides.push(slides[oldIndex]);
              } else { // newIndex < oldIndex
                // moved slide
                newSlides.push(slides[oldIndex]);
                // current slide pushed after
                newSlides.push(slide);
              }
            } else if (index > newIndex && index !== oldIndex) {
              newSlides.push(slide);
            }
          });
          if (newSlides.length > 0) {
            _.each( newSlides, function(slide, index) {
              newSlides[index].order = index;
            });
            let query = {};
            query['chapters.' + item.dataset.chapter + '.slides'] = '';
            Presentations.update({ _id: Router.current().params.prez }, { $unset: query }, function () {
              query['chapters.' + item.dataset.chapter + '.slides'] = newSlides;
              Presentations.update({ _id: Router.current().params.prez }, { $set: query });
            });
          }
        }
      }
    },
  });
});

Template.editSidebar.helpers({
  presentation () {
    return Presentations.findOne({ _id: Router.current().params.prez });
  },
  isActiveSlide (chapterIndex, slideIndex) {
    let prezIndex = PrezIndexes.findOne({ _id: Router.current().params.prez });
    if (prezIndex && prezIndex.chapterViewIndex === chapterIndex && prezIndex.slideViewIndex === slideIndex) {
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
      return 'image';
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
  isOnlyOneChapter () {
    let prez = Presentations.findOne({ _id: Router.current().params.prez });
    if (prez && prez.chapters) {
      return prez.chapters.length === 1;
    }
    return false;
  },
});

Template.editSidebar.events({
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
            title: 'Slide ' + Number(currentChapter.slides.length + 1),
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
              },
              {
                answerId: Random.id(),
                text: 'Answer 2',
                minValue: 0,
                maxValue: 5,
                order: 1,
                value: 1,
                isRightAnswer: false,
              },
              {
                answerId: Random.id(),
                text: 'Answer 3',
                minValue: 0,
                maxValue: 5,
                order: 2,
                value: 1,
                isRightAnswer: false,
              }],
            }],
          });
          Presentations.update({ _id: prez._id }, { $set: {
            chapters: chapters,
            slideViewIndex: prez.slideViewIndex + 1,
          }}, function () {
            $('.newSlideType').modal('hide');
          });
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
        title: 'Chapter ' + Number(prez.chapters.length + 1),
        slides: [{
          title: prez.title + ', chapter ' + Number(prez.chapters.length + 1),
          order: 0,
          type: 'coverSlide',
          color: 'basic',
        }],
      });
      PrezIndexes.update({ _id: Router.current().params.prez }, {$set: {
        chapterViewIndex: prez.chapters.length - 1,
        slideViewIndex: 0,
      }});
      Presentations.update({ _id: Router.current().params.prez }, { $set: {
        chapters: chapters,
      }}, function () {
        $('.presentationSidebar').sidebar('hide');
      });
    }
  },
  'click .sidebarSlide' (event) {
    let prezIndex = PrezIndexes.findOne({ _id: Router.current().params.prez });
    let flip = 'ping';
    if (prezIndex.flip === flip) {
      flip = 'pong';
    }
    PrezIndexes.update({ _id: Router.current().params.prez }, { $set: {
      chapterViewIndex: event.currentTarget.dataset.chapter,
      slideViewIndex: event.currentTarget.dataset.index,
      flip: flip,
    }}, function () {
      $('.presentationSidebar').sidebar('hide');
    });
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
      if (chapters && chapters.length > 1) {
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
    }
  },
  'click .prezSettings' () {
    $('.prezSettings').popup('hide');
    $('.presentationSidebar').sidebar('hide');
    Router.go('settings', {prez: Router.current().params.prez});
  },
});
