Template.cloudStat.onCreated(function () {
  let questionIndex = this.data;
  let prez = Presentations.findOne({ _id: Router.current().params.prez });
  let prezIndex = PrezIndexes.findOne({ _id: Router.current().params.prez });
  if (prezIndex && Router.current().params.chapter >= 0 && Router.current().params.slide >= 0) {
    prezIndex.chapterViewIndex = Router.current().params.chapter;
    prezIndex.slideViewIndex = Router.current().params.slide;
  }
  let questionId = prez.chapters[prezIndex.chapterViewIndex].slides[prezIndex.slideViewIndex].questions[questionIndex].questionId;
  this.questionId = questionId;
});

Template.cloudStat.onRendered(function () {
  let questionIndex = this.data;
  let template = this;
  let prez = Presentations.findOne({ _id: Router.current().params.prez });

  Tracker.autorun(function(c) {
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
      gridSize: 12,
      weightFactor: 32,
      fontWeight: 600,
      fontFamily: 'Lato, Helvetica Neue, Arial, Helvetica, sans-serif',
      shape: 'cloud',
      color: 'random-dark',
      rotateRatio: 0.5,
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

Template.cloudStat.onDestroyed(function () {
  let comp = Tracker.currentComputation;
  console.log(comp);
  if (comp && comp.active) {
    comp.stop();
  }
});
