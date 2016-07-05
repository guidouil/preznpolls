Template.gaugeStat.onCreated(function () {
  let questionIndex = this.data;
  let prez = Presentations.findOne({ _id: Router.current().params.prez });
  let answers = prez.chapters[prez.chapterViewIndex].slides[prez.slideViewIndex].questions[questionIndex].answers;
  console.log(answers);

  this.answers = new ReactiveVar(answers);
});


Template.gaugeStat.onRendered(function () {
  let questionIndex = this.data;
  let prez = Presentations.findOne({ _id: Router.current().params.prez });
  let answers = this.answers.get();
  let query = {};
  query['presentations.' + prez._id + '.chapters.' + prez.chapterViewIndex + '.slides.' + prez.slideViewIndex + '.questions.' + questionIndex + '.answers'] = {$exists: 1};
  let votes = Votes.find(query).fetch();
  let usersAnswers = [];
  _.each(votes, function( userVote, index) {
    if (userVote.presentations[prez._id].chapters[prez.chapterViewIndex].slides[prez.slideViewIndex].questions[questionIndex].answers) {
      let userAnswers = userVote.presentations[prez._id].chapters[prez.chapterViewIndex].slides[prez.slideViewIndex].questions[questionIndex].answers;
      _.each(userAnswers, function(userAnswer, answerIndex) {
        if (! usersAnswers[answerIndex]) {
          usersAnswers[answerIndex] = [];
        }
        usersAnswers[answerIndex].push(userAnswer);
      });
    }
  });

  _.each(answers, function(answer, answerIndex) {
    if (usersAnswers[answerIndex] && usersAnswers[answerIndex].length) {
      let answerTotal = 0;
      _.each(usersAnswers[answerIndex], function(answer, index) {
        answerTotal += answer.value;
      });
      let totalAnswers = usersAnswers[answerIndex].length
      let answerAverage = answerTotal / totalAnswers;
      let gauge = new JustGage({
        id: 'gauge_' + questionIndex + '_' + answerIndex,
        value: answerAverage,
        min: answer.minValue,
        max: answer.maxValue,
        title: answer.text,
        label: 'with ' + totalAnswers + ' responses',
      });
    }
  });
});

Template.gaugeStat.helpers({
  answers () {
    return Template.instance().answers.get();
  },
  questionIndex () {
    return Template.instance().data;
  },
});

Template.gaugeStat.events({

});
