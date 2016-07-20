Template.gaugeStat.onCreated(function () {
  let questionIndex = this.data;
  let prez = Presentations.findOne({ _id: Router.current().params.prez });
  let prezIndex = PrezIndexes.findOne({ _id: Router.current().params.prez });
  if (prezIndex && Router.current().params.chapter >= 0 && Router.current().params.slide >= 0) {
    prezIndex.chapterViewIndex = Router.current().params.chapter;
    prezIndex.slideViewIndex = Router.current().params.slide;
  }
  let answers = prez.chapters[prezIndex.chapterViewIndex].slides[prezIndex.slideViewIndex].questions[questionIndex].answers;
  let questionId = prez.chapters[prezIndex.chapterViewIndex].slides[prezIndex.slideViewIndex].questions[questionIndex].questionId;
  this.answers = answers;
  this.questionId = questionId;
});

Template.gaugeStat.onRendered(function () {
  let questionIndex = this.data;
  let template = this;
  Tracker.autorun(function(){
    let prez = Presentations.findOne({ _id: Router.current().params.prez });
    let answers = template.answers;
    let questionId = template.questionId;
    let query = {};
    query[prez._id + '.' + questionId] = {$exists: 1};
    let votes = Votes.find(query).fetch();

    let usersAnswers = [];
    _.each(votes, function( userVote, index) {
      if (userVote[prez._id][questionId]) {
        let userAnswers = userVote[prez._id][questionId];
        _.each(userAnswers, function(userAnswer, answerIndex) {
          if (! usersAnswers[userAnswer.id]) {
            usersAnswers[userAnswer.id] = [];
          }
          usersAnswers[userAnswer.id].push(userAnswer);
        });
      }
    });

    _.each(answers, function(answer, answerIndex) {
      if (usersAnswers[answer.answerId] && usersAnswers[answer.answerId].length) {
        let answerTotal = 0;
        _.each(usersAnswers[answer.answerId], function(answer, index) {
          answerTotal += Number(answer.value);
        });
        let answersCount = usersAnswers[answer.answerId].length
        let answerAverage = Math.round(answerTotal / answersCount * 100) / 100;
        $('#gauge_' + answer.answerId).html('');
        let gauge = new JustGage({
          id: 'gauge_' + answer.answerId,
          value: answerAverage,
          min: answer.minValue,
          max: answer.maxValue,
          title: answer.text,
          label: 'Average with\n' + answersCount + ' responses',
          counter: true,
          formatNumber: true,
        });
      }
    });
  });
});

Template.gaugeStat.helpers({
  answers () {
    return Template.instance().answers;
  },
});

Template.gaugeStat.events({

});
