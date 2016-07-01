Template.rangesPoll.helpers({
});

Template.rangesPoll.events({
  'click .submitRange' () {
    let prezId = Router.current().params.prez;
    let votes = Votes.findOne({_id: prezId + '_ranges'});
    if (! votes) {
      Votes.insert({
        _id: prezId + '_ranges',
        'Experience': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        'Wow': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        'Interest': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        'Lightness': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        'totalVotes': 0,
      });
      votes = Votes.findOne({_id: prezId + '_ranges'});
    }
    let exp = $('#input-2').val();
    let wow = $('#input-3').val();
    let inte = $('#input-4').val();
    let light = $('#input-5').val();
    votes.Experience[exp] ++;
    votes.Wow[wow] ++;
    votes.Interest[inte] ++;
    votes.Lightness[light] ++;
    votes.totalVotes ++;
    delete votes._id;
    Votes.update({ _id: prezId + '_ranges' }, { $set: votes });
    Session.set('currentStat', 'barStat');
    Session.set('currentVoteId', 'ranges');
  },
});

Template.rangesPoll.onRendered(function () {
  $('#range-2').range({
    min: 0,
    max: 10,
    start: 1,
    input: '#input-2',
    onChange: function(value) {
      $('#display-2').html('(' + value + ')');
    },
  });
  $('#range-3').range({
    min: 0,
    max: 10,
    start: 1,
    input: '#input-3',
    onChange: function(value) {
      $('#display-3').html('(' + value + ')');
    },
  });
  $('#range-4').range({
    min: 0,
    max: 10,
    start: 1,
    input: '#input-4',
    onChange: function(value) {
      $('#display-4').html('(' + value + ')');
    },
  });
  $('#range-5').range({
    min: 0,
    max: 10,
    start: 1,
    input: '#input-5',
    onChange: function(value) {
      $('#display-5').html('(' + value + ')');
    },
  });
});
