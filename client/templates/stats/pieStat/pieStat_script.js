let Highcharts = require('highcharts');

Template.pieStat.helpers({
});

Template.pieStat.events({
  'click .backToPoll' () {
    Session.delete('currentStat');
  },
});

Template.pieStat.onRendered(function () {
  let voteId = Session.get('currentVoteId');
  if (voteId) {
    Tracker.autorun(function () {
      let votes = Votes.findOne({ _id: voteId });
      if (votes) {
        delete votes._id;
        let totalVotes = sum(votes);
        let votesData = [];
        _.each( votes, function( voteCount, voteLabel){
          let vote = {
            name: voteLabel,
            color: voteLabel,
            y: (voteCount * 100) / totalVotes,
          };
          votesData.push(vote);
        })
        $(function () {
          $('#pieChart').highcharts({
            chart: {
              plotBackgroundColor: null,
              plotBorderWidth: null,
              plotShadow: false,
              type: 'pie'
            },
            title: {
              text: 'Favorite colors'
            },
            tooltip: {
              pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
              pie: {
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
              name: 'Share',
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
