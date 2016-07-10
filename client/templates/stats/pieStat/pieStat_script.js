let Highcharts = require('highcharts');

Template.pieStat.onCreated(function () {
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
});

Template.pieStat.helpers({
  totalVotes () {
    let questionId = Template.instance().questionId;
    let prezId = Router.current().params.prez;
    let query = {};
    query[prezId + '.' + questionId] = {$exists: 1};
    return Votes.find(query).count();
  },
  questionId () {
    return Template.instance().questionId;
  },
});

Template.pieStat.events({

});

Template.pieStat.onRendered(function () {
  let template = this;
  Tracker.autorun(function () {
    let prez = Router.current().params.prez;
    let answers = template.answers;
    let questionId = template.questionId;
    let query = {};
    query[prez + '.' + questionId] = {$exists: 1};
    let votesCursor = Votes.find(query);
    let votes = votesCursor.fetch();
    let totalVotes = votesCursor.count();

    if (votes && totalVotes) {
      let usersAnswers = [];
      _.each(votes, function(userVote) {
        if (userVote[prez][questionId]) {
          let userAnswers = userVote[prez][questionId];
          _.each(userAnswers, function(userAnswer) {
            if (! usersAnswers[userAnswer.id]) {
              usersAnswers[userAnswer.id] = [];
            }
            usersAnswers[userAnswer.id].push(userAnswer);
          });
        }
      });

      let votesData = [];
      _.each(answers, function(answer) {
        if (usersAnswers[answer.answerId] && usersAnswers[answer.answerId].length) {
          let vote = {
            name: answer.text,
            y: (usersAnswers[answer.answerId].length * 100) / totalVotes,
            sliced: answer.isRightAnswer,
            selected: answer.isRightAnswer,
          };
          if (answer.color) {
            vote.color = answer.color;
          }
          votesData.push(vote);
        }
      });

      votesData = _.sortBy(votesData, 'y');
      $(function () {
        $('#pieChart_' + questionId).highcharts({
          chart: {
            type: 'pie',
            options3d: {
              enabled: true,
              alpha: 45,
              beta: 0,
            },
          },
          title: {
            text: false,
          },
          tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
          },
          plotOptions: {
            pie: {
              depth: 35,
              allowPointSelect: true,
              cursor: 'pointer',
              dataLabels: {
                enabled: true,
                format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                style: {
                  color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black',
                },
              },
            },
          },
          credits: {
            enabled: false,
          },
          series: [{
            name: 'Value',
            colorByPoint: true,
            data: votesData,
          }],
        });
      });
    }
  });
});
