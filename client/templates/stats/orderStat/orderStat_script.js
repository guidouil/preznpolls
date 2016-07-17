Template.orderStat.onCreated(function () {
  let questionIndex = this.data;
  let prez = Presentations.findOne({ _id: Router.current().params.prez });
  if (prez && Router.current().params.chapter >= 0 && Router.current().params.slide >= 0) {
    prez.chapterViewIndex = Router.current().params.chapter;
    prez.slideViewIndex = Router.current().params.slide;
  }
  let answers = prez.chapters[prez.chapterViewIndex].slides[prez.slideViewIndex].questions[questionIndex].answers;
  let questionId = prez.chapters[prez.chapterViewIndex].slides[prez.slideViewIndex].questions[questionIndex].questionId;
  this.answers = answers;
  this.questionId = questionId;
  this.votersCount = new ReactiveVar(0);
});

Template.orderStat.helpers({
  usersOrderedAnswers () {
    let template = Template.instance();
    let questionIndex = template.data;
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

    let usersOrderedAnswers = [];
    _.each(answers, function(answer) {
      if (usersAnswers[answer.answerId] && usersAnswers[answer.answerId].length) {
        let answerTotal = 0;
        _.each(usersAnswers[answer.answerId], function(userAnswer) {
          answerTotal += Number(userAnswer.value);
        });
        let answersCount = usersAnswers[answer.answerId].length;
        template.votersCount.set(answersCount);
        let answerAverage = Math.round(answerTotal / answersCount * 100) / 100;
        usersOrderedAnswers.push({
          text: answer.text,
          rank: answerAverage,
          color: answer.color,
        });
      }
    });
    return _.sortBy(usersOrderedAnswers, 'rank');
  },
  votersCount () {
    return Template.instance().votersCount.get();
  },
});

Template.orderStat.events({
});

Template.orderStat.onRendered(function () {
});
