Template.wordsQuestion.helpers({
  questionId () {
    let questionIndex = Template.instance().data;
    let prez = Presentations.findOne({ _id: Router.current().params.prez });
    if (questionIndex >= 0 && prez && prez.chapters[prez.chapterViewIndex].slides[prez.slideViewIndex].questions) {
      return prez.chapters[prez.chapterViewIndex].slides[prez.slideViewIndex].questions[questionIndex].questionId;
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