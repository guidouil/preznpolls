Template.wordsQuestion.helpers({
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
  isDisabled () {
    return (Router.current().route.getName() === 'edit' ? 'disabled' : '');
  },
});

Template.wordsQuestion.events({
});

Template.wordsQuestion.onRendered(function () {
  $('.addAnswerBtn').addClass('disabled');
});

Template.wordsQuestion.onDestroyed(function () {
  $('.addAnswerBtn').removeClass('disabled');
});
