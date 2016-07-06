Template.singleChoiceQuestion.helpers({
  questionId () {
    let questionIndex = Template.instance().data;
    let prez = Presentations.findOne({ _id: Router.current().params.prez });
    if (questionIndex >= 0 && prez) {
      return prez.chapters[prez.chapterViewIndex].slides[prez.slideViewIndex].questions[questionIndex].questionId;
    }
    return false;
  },
  answers () {
    let questionIndex = Template.instance().data;
    let prez = Presentations.findOne({ _id: Router.current().params.prez });
    if (questionIndex >= 0 && prez) {
      return prez.chapters[prez.chapterViewIndex].slides[prez.slideViewIndex].questions[questionIndex].answers;
    }
    return false;
  },
  indexes () {
    let questionIndex = Template.instance().data;
    let prez = Presentations.findOne({ _id: Router.current().params.prez });
    if (questionIndex >= 0 && prez) {
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

Template.singleChoiceQuestion.events({
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
  'change .answerInput' (event) {
    let answerId = this.answerId;
    let questionId = event.currentTarget.name;
    $( "input[name='" + questionId + "']" ).each(function(index, el) {
      el.value = '';
    });
    $('#' + answerId).val(1);
  },
});

Template.singleChoiceQuestion.onRendered(function () {
  makeEditable();
  $('.dropdown').dropdown();
});
