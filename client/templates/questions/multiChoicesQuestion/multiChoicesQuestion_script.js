Template.multiChoicesQuestion.helpers({
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
  isChecked () {
    if (this.isRightAnswer) {
      return 'checked';
    }
    return '';
  },
});

Template.multiChoicesQuestion.events({
  'change .answerColor' (event, tmpl) {
    let answerId = this.answerId;
    let field = tmpl.find('#colorInput_' + answerId).value;
    let color = tmpl.find('#color_' + answerId + ' :selected').value;
    let query = {};
    query[field] = color;
    Presentations.update({ _id: Router.current().params.prez }, { $set: query });
  },
  'change .isRightAnswer' (event, tmpl) {
    let answerId = this.answerId;
    let field = tmpl.find('#isRightAnswer_' + answerId).value;
    let isRightAnswer = tmpl.find('#isRightAnswer_' + answerId).checked;
    let query = {};
    query[field] = isRightAnswer;
    Presentations.update({ _id: Router.current().params.prez }, { $set: query });
  },
  'change .answerInput' (event) { // for voting
    let answerId = this.answerId;
    let checked = event.currentTarget.checked;
    if (checked) {
      $('#' + answerId).val(1);
    } else {
      $('#' + answerId).val('');
    }
  },
});

Template.multiChoicesQuestion.onRendered(function () {
  makeEditable();
  $('.dropdown').dropdown();
});
