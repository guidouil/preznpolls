Template.rangeQuestion.helpers({
});

Template.rangeQuestion.events({
});

Template.rangeQuestion.onRendered(function () {
  let answer = this.data;
  $('#range_' + answer.chapterIndex + '_' + answer.slideIndex + '_' + answer.questionIndex + '_' + answer.answerIndex).range({
    min: answer.minValue,
    max: answer.maxValue,
    start: answer.maxValue / 2,
    onChange: function(value) {
      $('#display_' + answer.chapterIndex + '_' + answer.slideIndex + '_' + answer.questionIndex + '_' + answer.answerIndex).html('(' + value + ')');
      $('#' + answer.chapterIndex + '_' + answer.slideIndex + '_' + answer.questionIndex + '_' + answer.answerIndex).val(value);
    },
  });
});
