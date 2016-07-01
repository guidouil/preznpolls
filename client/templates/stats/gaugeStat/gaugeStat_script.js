Template.gaugeStat.helpers({
  totalVotes () {
    return Session.get('totalVotes');
  },
});

Template.gaugeStat.events({
  'click .backToPoll' () {
    Session.delete('currentStat');
  },
});

Template.gaugeStat.onRendered(function () {
  let voteId = Session.get('currentVoteId');
  let prezId = Router.current().params.prez;
  if (voteId) {
    Tracker.autorun(function () {
      let votes = Votes.findOne({ _id: prezId + '_' + voteId });
      if (votes) {
        Session.set('totalVotes', votes.totalVotes);

        let votesData = [];
        _.each(votes, function(pointsCount, voteLabel) {
          if (! _.contains(['_id', 'totalVotes'], voteLabel)) {
            let rateTotal = 0;
            _.each( pointsCount, function(voteCount, index) {
              rateTotal += voteCount * index;
            });
            let voteAverage = rateTotal / votes.totalVotes;
            votesData.push({
              title: voteLabel,
              value: voteAverage,
            });
          }
        });

        _.each( votesData, function(vote, index) {
          let g = new JustGage({
            id: 'gauge' + (index + 1),
            value: vote.value,
            min: 0,
            max: 10,
            title: vote.title,
          });
        });
      }
    });
  }
});
