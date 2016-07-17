Template.orderingQuestion.helpers({
  questionId () {
    let questionIndex = Template.instance().data;
    let prez = Presentations.findOne({ _id: Router.current().params.prez });
    if (prez && Router.current().params.chapter >= 0 && Router.current().params.slide >= 0) {
      prez.chapterViewIndex = Router.current().params.chapter;
      prez.slideViewIndex = Router.current().params.slide;
    }
    if (questionIndex >= 0 && prez && prez.chapters[prez.chapterViewIndex].slides[prez.slideViewIndex].questions) {
      return prez.chapters[prez.chapterViewIndex].slides[prez.slideViewIndex].questions[questionIndex].questionId;
    }
    return false;
  },
  question () {
    let questionIndex = Template.instance().data;
    let prez = Presentations.findOne({ _id: Router.current().params.prez });
    if (prez && Router.current().params.chapter >= 0 && Router.current().params.slide >= 0) {
      prez.chapterViewIndex = Router.current().params.chapter;
      prez.slideViewIndex = Router.current().params.slide;
    }
    if (questionIndex >= 0 && prez && prez.chapters[prez.chapterViewIndex].slides[prez.slideViewIndex].questions) {
      return prez.chapters[prez.chapterViewIndex].slides[prez.slideViewIndex].questions[questionIndex];
    }
    return false;
  },
  answers () {
    let questionIndex = Template.instance().data;
    let prez = Presentations.findOne({ _id: Router.current().params.prez });
    if (prez && Router.current().params.chapter >= 0 && Router.current().params.slide >= 0) {
      prez.chapterViewIndex = Router.current().params.chapter;
      prez.slideViewIndex = Router.current().params.slide;
    }
    if (questionIndex >= 0 && prez && prez.chapters[prez.chapterViewIndex].slides[prez.slideViewIndex].questions) {
      return prez.chapters[prez.chapterViewIndex].slides[prez.slideViewIndex].questions[questionIndex].answers;
    }
    return false;
  },
  indexes () {
    let questionIndex = Template.instance().data;
    let prez = Presentations.findOne({ _id: Router.current().params.prez });
    if (prez && Router.current().params.chapter >= 0 && Router.current().params.slide >= 0) {
      prez.chapterViewIndex = Router.current().params.chapter;
      prez.slideViewIndex = Router.current().params.slide;
    }
    if (questionIndex >= 0 && prez && prez.chapters[prez.chapterViewIndex].slides[prez.slideViewIndex].questions) {
      return {
        chapterIndex: prez.chapterViewIndex,
        slideIndex: prez.slideViewIndex,
        questionIndex: questionIndex,
      };
    }
    return false;
  },
});

Template.orderingQuestion.events({
  'change .answerColor' (event, tmpl) {
    let answerId = this.answerId;
    let field = tmpl.find('#colorInput_' + answerId).value;
    let color = tmpl.find('#color_' + answerId + ' :selected').value;
    let query = {};
    query[field] = color;
    Presentations.update({ _id: Router.current().params.prez }, { $set: query });
  },
});

Template.orderingQuestion.onRendered(function () {
  makeEditable();
  $('.dropdown').dropdown();
  let container = document.getElementById('answersContainer');
  let sort = Sortable.create(container, {
    animation: 150,
    draggable: '.orderAnswerBtn',
  });
});
