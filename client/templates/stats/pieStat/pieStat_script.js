let Highcharts = require('highcharts');

Template.pieStat.helpers({
  voteId () {
    return Session.get('currentVoteId');
  },
  totalVotes () {
    let voteId = Session.get('currentVoteId');
    let prezId = Router.current().params.prez;
    let votes = Votes.findOne({ _id: prezId + '_' + voteId });
    if (votes) {
      delete votes._id;
      return sum(votes);
    }
    return '#';
  },
});

Template.pieStat.events({
  'click .backToPoll' () {
    Session.delete('currentStat');
  },
});

Template.pieStat.onRendered(function () {
  let voteId = Session.get('currentVoteId');
  let prezId = Router.current().params.prez;
  if (voteId) {
    Tracker.autorun(function () {
      let votes = Votes.findOne({ _id: prezId + '_' + voteId });
      if (votes) {
        delete votes._id;
        let totalVotes = sum(votes);
        let votesData = [];
        _.each( votes, function( voteCount, voteLabel) {
          let vote = {
            name: voteLabel,
            y: (voteCount * 100) / totalVotes,
          };
          if (voteId === 'color') {
            vote.color = voteLabel.toLowerCase();
          }
          votesData.push(vote);
        });
        votesData = _.sortBy(votesData, 'y');
        $(function () {
          $('#pieChart').highcharts({
            chart: {
              type: 'pie',
              options3d: {
                enabled: true,
                alpha: 45,
                beta: 0
              }
            },
            title: {
              text: 'FAVORITE ' + voteId.toUpperCase()
            },
            tooltip: {
              pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
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
                      color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                  }
                }
              }
            },
            series: [{
              name: 'Value',
              colorByPoint: true,
              data: votesData
            }]
          });
        });
      }
    });
  }
});

function sum ( obj ) {
  let sum = 0;
  for ( let el in obj ) {
    if ( obj.hasOwnProperty( el ) ) {
      sum += parseFloat( obj[el] );
    }
  }
  return sum;
}
