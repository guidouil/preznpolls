Template.pollSlide.helpers({
  isQuestionType (questionType) {
    if (this.type === questionType) {
      return 'selected';
    }
    return '';
  },
  betterAnswer (answers, questionIndex, slideIndex, chapterIndex) {
    let betterAnswers = [];
    _.each(answers, function( answer, index) {
      answer.answerIndex = index;
      answer.questionIndex = questionIndex;
      answer.slideIndex = slideIndex;
      answer.chapterIndex = chapterIndex;
      betterAnswers.push(answer);
    });
    return betterAnswers;
  },
  hasVoted (questionIndex, slideIndex, chapterIndex) {
    let prez = Presentations.findOne({ _id: Router.current().params.prez });
    let vote = Votes.findOne({ _id: Meteor.userId() });
    if (
      vote && vote.presentations[prez._id] &&
      vote.presentations[prez._id].chapters[chapterIndex] &&
      vote.presentations[prez._id].chapters[chapterIndex].slides[slideIndex] &&
      vote.presentations[prez._id].chapters[chapterIndex].slides[slideIndex].questions[questionIndex] &&
      vote.presentations[prez._id].chapters[chapterIndex].slides[slideIndex].questions[questionIndex].answers &&
      vote.presentations[prez._id].chapters[chapterIndex].slides[slideIndex].questions[questionIndex].answers.length > 0
    ) {
      return true;
    }
    return false;
  },
  hasVotedAll (slideIndex, chapterIndex) {
    let prez = Presentations.findOne({ _id: Router.current().params.prez });
    let vote = Votes.findOne({ _id: Meteor.userId() });
    if (
      vote && vote.presentations[prez._id] &&
      vote.presentations[prez._id].chapters[chapterIndex] &&
      vote.presentations[prez._id].chapters[chapterIndex].slides[slideIndex] &&
      vote.presentations[prez._id].chapters[chapterIndex].slides[slideIndex].questions
    ) {
      let answeredQuestions = vote.presentations[prez._id].chapters[chapterIndex].slides[slideIndex].questions;
      return Object.keys(answeredQuestions).length === prez.chapters[chapterIndex].slides[slideIndex].questions.length;
    }
    return false;
  },
});

Template.pollSlide.events({
  'click .addQuestionBtn' () {
    $('.questionTitleModal').modal({
      onApprove: function() {
        let questionTitle = $('#questionTitle').val();
        let prez = Presentations.findOne({ _id: Router.current().params.prez });
        if (prez) {
          let questions = prez.chapters[prez.chapterViewIndex].slides[prez.slideViewIndex].questions
          let questionsLength = (questions ? questions.length : 0);
          let newQuestion = {};
          newQuestion['chapters.' + prez.chapterViewIndex + '.slides.' + prez.slideViewIndex + '.questions'] = {
            text: questionTitle,
            type: 'rangeQuestion',
            stat: 'gaugeStat',
            order: questionsLength,
            description: 'Question description',
            help: 'Question additional help',
            answers: [{
              text: 'Answer text',
              minValue: 0,
              maxValue: 5,
              order: 0,
            }],
          };
          Presentations.update({ _id: Router.current().params.prez }, { $push: newQuestion });
        }
      },
    }).modal('show');
  },
  'click .addAnswerBtn' (event) {
    let questionIndex = event.currentTarget.dataset.ref;
    let prez = Presentations.findOne({ _id: Router.current().params.prez });
    if (prez) {
      let answers = prez.chapters[prez.chapterViewIndex].slides[prez.slideViewIndex].questions[questionIndex].answers;
      let answersLength = (answers ? answers.length : 0);
      let newAnswer = {};
      newAnswer['chapters.' + prez.chapterViewIndex + '.slides.' + prez.slideViewIndex + '.questions.' + questionIndex + '.answers'] ={
        text: 'Answer text',
        minValue: 0,
        maxValue: 5,
        order: answersLength,
      };
      Presentations.update({ _id: Router.current().params.prez }, { $push: newAnswer });
    }
  },
  'click .submitAnswersBtn' () {
    let prez = Presentations.findOne({ _id: Router.current().params.prez });
    if (Meteor.userId() && prez) {
      $('.submitAnswersBtn').addClass('loading');
      let answers = {};
      $('.answerInput').each(function(index, answer) {
        if (answer.value) {
          let indexes = answer.id.split('_');
          if (! answers[indexes[2]]) {
            answers[indexes[2]] = [];
          }
          answers[indexes[2]].push({
            id: answer.id,
            value: answer.value,
            text: answer.dataset.ref,
            time: new Date(),
          });
        }
      });
      let questions = prez.chapters[prez.chapterViewIndex].slides[prez.slideViewIndex].questions;
      if (questions) {
        _.each(questions, function(question, index) {
          if (answers[index]) {
            if (question && question.minAnswers && answers[index].length < question.minAnswers) {
              $('.submitAnswersBtn').removeClass('loading');
              alert('Not enough answer for question: ' + question.text);
              return false;
            }
            if (question && question.maxAnswers && answers[index].length > question.maxAnswers) {
              $('.submitAnswersBtn').removeClass('loading');
              alert('To many answers for question: ' + question.text);
              return false;
            }
            Meteor.call('upsertVote', Router.current().params.prez, prez.chapterViewIndex, prez.slideViewIndex, index, answers[index]);
          }
        });
        $('.submitAnswersBtn').removeClass('loading');
      }
    }
  },
});

Template.pollSlide.onRendered(function () {
  makeEditable();
  $('#questionTitle').keypress(function (e) {
    if (e.which === 13) {
      $('.validateQuestionAdd').click();
      return false;
    }
  });
  $('.dropdown').dropdown();
});
