Template.rangeQuestion.helpers({
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
  betterAnswer (answers, questionIndex, slideIndex, chapterIndex) {
    let betterAnswers = [];
    _.each(answers, function( answer, index) {
      answer.answerIndex = index;
      answer.questionIndex = questionIndex;
      answer.slideIndex = slideIndex;
      answer.chapterIndex = chapterIndex;
      betterAnswers.push(answer);
    });
    return betterAnswers;
  },
});

Template.rangeQuestion.events({
  'change .answerColor' (event, tmpl) {
    let answerId = this.answerId;
    let field = tmpl.find('#colorInput_' + answerId).value;
    let color = tmpl.find('#color_' + answerId + ' :selected').value;
    let query = {};
    query[field] = color;
    Presentations.update({ _id: Router.current().params.prez }, { $set: query });
  }
});

Template.rangeQuestion.onRendered(function () {
  let questionIndex = this.data;
  Tracker.autorun(function () {
    let prez = Presentations.findOne({ _id: Router.current().params.prez });
    if (questionIndex >= 0 && prez) {
      let answers = prez.chapters[prez.chapterViewIndex].slides[prez.slideViewIndex].questions[questionIndex].answers;
      _.each(answers, function(answer) {
        $('#range_' + answer.answerId).range({
          min: answer.minValue,
          max: answer.maxValue,
          start: answer.maxValue / 2,
          onChange: function(value) {
            $('#display_' + answer.answerId).html('(' + value + ')');
            $('#' + answer.answerId).val(value);
          },
        });
      });
      makeEditable();
      $('.dropdown').dropdown();
    }
  });
});
