Template.pollSlide.helpers({
  isQuestionType (questionType) {
    if (this.type === questionType) {
      return 'selected';
    }
    return '';
  },

  showAnswersStat (questionId) {
    if (Router.current().route.getName() === 'edit') {
      return false;
    }
    if (Session.equals('showMeTheStat', true)) {
      return true;
    }
    if (Session.equals('showMeTheStat', false)) {
      return false;
    }
    let prez = Router.current().params.prez;
    let vote = Votes.findOne({ _id: Meteor.userId() });
    if (vote && vote[prez] && vote[prez][questionId]) {
      return true;
    }
    return false;
  },
  hasVotedAll () {
    let prez = Presentations.findOne({ _id: Router.current().params.prez });
    let prezIndex = PrezIndexes.findOne({ _id: Router.current().params.prez });
    if (prezIndex && Router.current().params.chapter >= 0 && Router.current().params.slide >= 0) {
      prezIndex.chapterViewIndex = Router.current().params.chapter;
      prezIndex.slideViewIndex = Router.current().params.slide;
    }
    let questions = prez.chapters[prezIndex.chapterViewIndex].slides[prezIndex.slideViewIndex].questions;
    let votes = Votes.findOne({ _id: Meteor.userId() });
    if (questions && votes && votes[prez._id]) {
      let allAnswersFound = true;
      _.each(questions, function (question) {
        if (! votes[prez._id][question.questionId]) {
          allAnswersFound = false;
        }
      });
      return allAnswersFound;
    }
    return false;
  },
});

Template.pollSlide.events({
  'change .slideColor' (event, tmpl) {
    let field = tmpl.find('#slideColorInput').value;
    let color = tmpl.find('#slideColor :selected').value;
    if (color === 'white') {
      color = 'basic';
    } else if (color === 'black') {
      color = 'inverted';
    } else if (color) {
      color = 'inverted ' + color;
    }
    let query = {};
    query[field] = color;
    Presentations.update({ _id: Router.current().params.prez }, { $set: query });
  },
  'click .addQuestionBtn' () {
    let prez = Presentations.findOne({ _id: Router.current().params.prez });
    let prezIndex = PrezIndexes.findOne({ _id: Router.current().params.prez });
    if (prez && prezIndex) {
      let questionTitle = 'What is the question?';
      let questions = prez.chapters[prezIndex.chapterViewIndex].slides[prezIndex.slideViewIndex].questions
      let questionsLength = (questions ? questions.length : 0);
      let newQuestion = {};
      newQuestion['chapters.' + prezIndex.chapterViewIndex + '.slides.' + prezIndex.slideViewIndex + '.questions'] = {
        questionId: Random.id(),
        text: questionTitle,
        type: 'singleChoiceQuestion',
        stat: 'pieStat',
        order: questionsLength,
        description: '',
        help: '',
        answers: [{
          answerId: Random.id(),
          text: 'Answer 1',
          minValue: 0,
          maxValue: 5,
          order: 0,
          value: 1,
          isRightAnswer: false,
        },
        {
          answerId: Random.id(),
          text: 'Answer 2',
          minValue: 0,
          maxValue: 5,
          order: 1,
          value: 1,
          isRightAnswer: false,
        },
        {
          answerId: Random.id(),
          text: 'Answer 3',
          minValue: 0,
          maxValue: 5,
          order: 2,
          value: 1,
          isRightAnswer: false,
        }],
      };
      Presentations.update({ _id: Router.current().params.prez }, { $push: newQuestion });
      makeEditable();
    }
  },
  'click .addAnswerBtn' (event) {
    let questionIndex = event.currentTarget.dataset.ref;
    let prez = Presentations.findOne({ _id: Router.current().params.prez });
    let prezIndex = PrezIndexes.findOne({ _id: Router.current().params.prez });
    if (prez && prezIndex) {
      let answers = prez.chapters[prezIndex.chapterViewIndex].slides[prezIndex.slideViewIndex].questions[questionIndex].answers;
      let answersLength = (answers ? answers.length : 0);
      let newAnswer = {};
      newAnswer['chapters.' + prezIndex.chapterViewIndex + '.slides.' + prezIndex.slideViewIndex + '.questions.' + questionIndex + '.answers'] = {
        answerId: Random.id(),
        text: 'Answer ' + Number(answersLength + 1),
        minValue: 0,
        maxValue: 5,
        order: answersLength,
        value: 1,
        isRightAnswer: false,
      };
      Presentations.update({ _id: Router.current().params.prez }, { $push: newAnswer }, function () {
        makeEditable();
      });
    }
  },
  'click .submitAnswersBtn' () {
    let prez = Presentations.findOne({ _id: Router.current().params.prez });
    let prezIndex = PrezIndexes.findOne({ _id: Router.current().params.prez });
    if (Meteor.userId() && prez && prezIndex) {
      $('.submitAnswersBtn').addClass('loading');
      let answers = {};
      // regular question answers
      $('.answerInput').each(function(index, answer) {
        if (answer.value) {
          if (! answers[answer.dataset.question]) {
            answers[answer.dataset.question] = [];
          }
          answers[answer.dataset.question].push({
            id: answer.id,
            value: answer.value,
            text: answer.dataset.ref,
            time: new Date(),
          });
        }
      });
      // Multi Points (rating) question
      $('.rating').each(function(index, answer) {
        let rating = $(answer).rating('get rating');
        if (rating > 0) {
          if (! answers[answer.dataset.question]) {
            answers[answer.dataset.question] = [];
          }
          answers[answer.dataset.question].push({
            id: answer.id,
            value: rating,
            text: answer.dataset.ref,
            time: new Date(),
          });
        }
      });
      // Words question answer
      $('.wordsAnswer').each(function(index, answer) {
        if (answer.value) {
          let words = answer.value.toUpperCase().split(/,|\n/).map(Function.prototype.call, String.prototype.trim);
          answers[answer.dataset.question] = _.uniq(words);
        }
      });

      // Ordering question answers
      $('#answersContainer').children('.orderAnswerBtn').each(function(index, answer) {
        if (! answers[answer.dataset.question]) {
          answers[answer.dataset.question] = [];
        }
        answers[answer.dataset.question].push({
          id: answer.id,
          value: Number(index + 1),
          text: answer.innerText,
          time: new Date(),
        });
      });

      if (Router.current().params.chapter >= 0 && Router.current().params.slide >= 0) {
        prezIndex.chapterViewIndex = Router.current().params.chapter;
        prezIndex.slideViewIndex = Router.current().params.slide;
      }
      let questions = prez.chapters[prezIndex.chapterViewIndex].slides[prezIndex.slideViewIndex].questions;
      if (questions) {
        _.each(questions, function(question) {
          if (answers[question.questionId]) {
            if (question && question.minAnswers && answers[question.questionId].length < question.minAnswers) {
              $('.submitAnswersBtn').removeClass('loading');
              alert('Not enough answer for question: ' + question.text);
              return false;
            }
            if (question && question.maxAnswers && answers[question.questionId].length > question.maxAnswers) {
              $('.submitAnswersBtn').removeClass('loading');
              alert('Maximum of ' + question.maxAnswers + ' answers for question: ' + question.text);
              return false;
            }
            Meteor.call('upsertVote', Router.current().params.prez, question.questionId, answers[question.questionId]);
          }
          return true;
        });
        $('.submitAnswersBtn').removeClass('loading');
      }
    }
  },
  'click .cancelAnswer' (event) {
    let questionId = event.currentTarget.dataset.ref;
    let prez = Router.current().params.prez;
    if (Meteor.userId() && prez && questionId) {
      let query = {};
      query[prez + '.' + questionId] = '';
      Votes.update({ _id: Meteor.userId() }, { $unset: query });
    }
  },
  'click .deleteQuestionBtn' (event) {
    $('.deleteQuestionModal').modal({
      onApprove: function() {
        let questionIndex = event.currentTarget.dataset.ref;
        let prezIndex = PrezIndexes.findOne({ _id: Router.current().params.prez });
        if (prezIndex) {
          let query = {};
          let queryTwo = {};
          query['chapters.' + prezIndex.chapterViewIndex + '.slides.' + prezIndex.slideViewIndex + '.questions.' + questionIndex] = '';
          queryTwo['chapters.' + prezIndex.chapterViewIndex + '.slides.' + prezIndex.slideViewIndex + '.questions'] = null;
          Presentations.update({ _id: Router.current().params.prez }, { $unset: query }, function () {
            Presentations.update({ _id: Router.current().params.prez }, { $pull: queryTwo });
          });
        }
      },
    }).modal('show');
  },
  'click .deleteAnswerBtn' (event) {
    let questionIndex = event.currentTarget.dataset.index;
    let answerIndex = event.currentTarget.dataset.ref;
    let prezIndex = PrezIndexes.findOne({ _id: Router.current().params.prez });
    if (prezIndex) {
      let query = {};
      let queryTwo = {};
      query['chapters.' + prezIndex.chapterViewIndex + '.slides.' + prezIndex.slideViewIndex + '.questions.' + questionIndex + '.answers.' + answerIndex] = '';
      queryTwo['chapters.' + prezIndex.chapterViewIndex + '.slides.' + prezIndex.slideViewIndex + '.questions.' + questionIndex + '.answers'] = null;
      Presentations.update({ _id: Router.current().params.prez }, { $unset: query }, function () {
        Presentations.update({ _id: Router.current().params.prez }, { $pull: queryTwo });
      });
    }
  },
  'change .questionType' (event, tmpl) {
    let questionId = this.questionId;
    let field = tmpl.find('#type_' + questionId).value;
    let type = tmpl.find('#typeSelect_' + questionId + ' :selected').value;
    let query = {};
    query[field] = type;

    // Dirty hack to rework!
    let stat = 'pieStat';
    let minAnswers = 0;
    let maxAnswers = 0;
    switch (type) {
    default:
    case 'singleChoiceQuestion':
      stat = 'pieStat';
      minAnswers = 1;
      maxAnswers = 1;
      break;
    case 'multiChoicesQuestion':
      stat = 'pieStat';
      minAnswers = 1;
      maxAnswers = 3;
      break;
    case 'rangeQuestion':
    case 'multiPointsQuestion':
      stat = 'gaugeStat';
      break;
    case 'wordsQuestion':
      stat = 'cloudStat';
      break;
    case 'orderingQuestion':
      stat = 'orderStat';
      break;
    }
    let statField = field.replace('.type', '.stat');
    query[statField] = stat;
    let minAnswersField = field.replace('.type', '.minAnswers');
    query[minAnswersField] = minAnswers;
    let maxAnswersField = field.replace('.type', '.maxAnswers');
    query[maxAnswersField] = maxAnswers;
    // EOH

    Presentations.update({ _id: Router.current().params.prez }, { $set: query });
  },
});

Template.pollSlide.onRendered(function () {
  $('#questionTitle').keypress(function (e) {
    if (e.which === 13) {
      $('.validateQuestionAdd').click();
      return false;
    }
  });
  $('.dropdown').dropdown();
  makeEditable();
  $('.questionHelp').popup();
});
