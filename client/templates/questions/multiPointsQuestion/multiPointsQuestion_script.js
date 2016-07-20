Template.multiPointsQuestion.helpers({
  questionId () {
    let questionIndex = Template.instance().data;
    let prez = Presentations.findOne({ _id: Router.current().params.prez });
    let prezIndex = PrezIndexes.findOne({ _id: Router.current().params.prez });
    if (prezIndex && Router.current().params.chapter >= 0 && Router.current().params.slide >= 0) {
      prezIndex.chapterViewIndex = Router.current().params.chapter;
      prezIndex.slideViewIndex = Router.current().params.slide;
    }
    if (questionIndex >= 0 && prez && prezIndex && prez.chapters[prezIndex.chapterViewIndex].slides[prezIndex.slideViewIndex].questions) {
      return prez.chapters[prezIndex.chapterViewIndex].slides[prezIndex.slideViewIndex].questions[questionIndex].questionId;
    }
    return false;
  },
  question () {
    let questionIndex = Template.instance().data;
    let prez = Presentations.findOne({ _id: Router.current().params.prez });
    let prezIndex = PrezIndexes.findOne({ _id: Router.current().params.prez });
    if (prezIndex && Router.current().params.chapter >= 0 && Router.current().params.slide >= 0) {
      prezIndex.chapterViewIndex = Router.current().params.chapter;
      prezIndex.slideViewIndex = Router.current().params.slide;
    }
    if (questionIndex >= 0 && prez && prezIndex && prez.chapters[prezIndex.chapterViewIndex].slides[prezIndex.slideViewIndex].questions) {
      return prez.chapters[prezIndex.chapterViewIndex].slides[prezIndex.slideViewIndex].questions[questionIndex];
    }
    return false;
  },
  answers () {
    let questionIndex = Template.instance().data;
    let prez = Presentations.findOne({ _id: Router.current().params.prez });
    let prezIndex = PrezIndexes.findOne({ _id: Router.current().params.prez });
    if (prezIndex && Router.current().params.chapter >= 0 && Router.current().params.slide >= 0) {
      prezIndex.chapterViewIndex = Router.current().params.chapter;
      prezIndex.slideViewIndex = Router.current().params.slide;
    }
    if (questionIndex >= 0 && prez && prezIndex && prez.chapters[prezIndex.chapterViewIndex].slides[prezIndex.slideViewIndex].questions) {
      return prez.chapters[prezIndex.chapterViewIndex].slides[prezIndex.slideViewIndex].questions[questionIndex].answers;
    }
    return false;
  },
  indexes () {
    let questionIndex = Template.instance().data;
    let prez = Presentations.findOne({ _id: Router.current().params.prez });
    let prezIndex = PrezIndexes.findOne({ _id: Router.current().params.prez });
    if (prezIndex && Router.current().params.chapter >= 0 && Router.current().params.slide >= 0) {
      prezIndex.chapterViewIndex = Router.current().params.chapter;
      prezIndex.slideViewIndex = Router.current().params.slide;
    }
    if (questionIndex >= 0 && prez && prezIndex && prez.chapters[prezIndex.chapterViewIndex].slides[prezIndex.slideViewIndex].questions) {
      return {
        chapterIndex: prezIndex.chapterViewIndex,
        slideIndex: prezIndex.slideViewIndex,
        questionIndex: questionIndex,
      };
    }
    return false;
  },
  icons () {
    return ['star', 'heart'];
  },
  isSelectedIcon (icon, value) {
    return (icon === value ? 'selected' : '');
  },
});

Template.multiPointsQuestion.events({
  'change .answerColor' (event, tmpl) {
    let answerId = this.answerId;
    let field = tmpl.find('#colorInput_' + answerId).value;
    let color = tmpl.find('#color_' + answerId + ' :selected').value;
    let query = {};
    query[field] = color;
    Presentations.update({ _id: Router.current().params.prez }, { $set: query });
  },
  'change .answerIcon' (event, tmpl) {
    let answerId = this.answerId;
    let field = tmpl.find('#iconInput_' + answerId).value;
    let icon = tmpl.find('#icon_' + answerId + ' :selected').value;
    let query = {};
    query[field] = icon;
    Presentations.update({ _id: Router.current().params.prez }, { $set: query });
  },
});

Template.multiPointsQuestion.onRendered(function () {
  makeEditable();
  $('.dropdown').dropdown();
  $('.rating').rating({
    initialRating: 0,
    maxRating: 5,
    clearable: true,
  });
});
