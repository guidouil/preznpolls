Template.cloudStat.onCreated(function () {
  let questionIndex = this.data;
  let prez = Presentations.findOne({ _id: Router.current().params.prez });
  let questionId = prez.chapters[prez.chapterViewIndex].slides[prez.slideViewIndex].questions[questionIndex].questionId;
  this.questionId = questionId;
});

Template.cloudStat.onRendered(function () {
  let questionIndex = this.data;
  let template = this;
  let prez = Presentations.findOne({ _id: Router.current().params.prez });

  Tracker.autorun(function(){
    let questionId = template.questionId;
    let query = {};
    query[prez._id + '.' + questionId] = {$exists: 1};
    let votes = Votes.find(query).fetch();

    let usersAnswers = [];
    _.each(votes, function( userVote) {
      if (userVote[prez._id][questionId]) {
        let userAnswers = userVote[prez._id][questionId];
        _.each(userAnswers, function(userAnswer) {
          if (userAnswer) {
            let found = false;
            _.each(usersAnswers, function( savedAnswer, index){
              if (savedAnswer && savedAnswer[0] === userAnswer) {
                savedAnswer[1] += 1;
                found = true;
              }
            });
            if (! found) {
              usersAnswers.push([userAnswer, 1]);
            }
          }
        });
      }
    });
    WordCloud(document.getElementById('wordscloud_' + questionId), {
      list: usersAnswers,
      gridSize: 8,
      weightFactor: 40,
      fontFamily: 'Lato, Helvetica Neue, Arial, Helvetica, sans-serif',
      color: 'random-dark',
      backgroundColor: '#f0f0f0',
      rotateRatio: 0.6,
    });
  });
});

Template.cloudStat.helpers({
  questionId () {
    return Template.instance().questionId;
  },
  cloudWidth () {
    if (window.screen.width > 1025) {
      return window.screen.width * 0.6;
    }
    return window.screen.width * 0.8;
  },
  cloudHeight () {
    return window.screen.height * 0.6;
  },
});

Template.cloudStat.events({
});
