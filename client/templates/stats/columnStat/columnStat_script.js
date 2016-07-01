let Highcharts = require('highcharts');

Template.columnStat.helpers({
});

Template.columnStat.events({
  'click .backToPoll' () {
    Session.set('clickCount', 0);
    Session.delete('currentStat');
  },
});

Template.columnStat.onRendered(function () {
  let voteId = Session.get('currentVoteId');
  let prezId = Router.current().params.prez;
  if (voteId) {
    Tracker.autorun(function () {
      let votes = Votes.findOne({ _id: prezId + '_' + voteId });
      if (votes) {
        delete votes._id;
        let totalVotes = votes.totalVotes;
        delete votes.totalVotes;
        let votesData = [];
        _.each(votes, function(pointsCount, voteLabel){
          let vote = [voteLabel, pointsCount];
          votesData.push(vote);
        });

        $(function () {
          $('#columnChart').highcharts({
            chart: {
              type: 'column'
            },
            title: {
              text: 'Most choosed options with ' + totalVotes + ' votes'
            },
            xAxis: {
                type: 'category',
                labels: {
                    rotation: -45,
                    style: {
                        fontSize: '13px',
                        fontFamily: 'Verdana, sans-serif'
                    }
                }
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Points'
                }
            },
            legend: {
                enabled: false
            },
            tooltip: {
                pointFormat: 'Points: <b>{point.y}</b>'
            },
            credits: {
              enabled: false,
            },
            series: [{
                name: 'Points',
                data: votesData,
                dataLabels: {
                    enabled: true,
                    rotation: -90,
                    color: '#FFFFFF',
                    align: 'right',
                    format: '{point.y}', // one decimal
                    y: 10, // 10 pixels down from the top
                    style: {
                        fontSize: '13px',
                        fontFamily: 'Verdana, sans-serif'
                    }
                }
            }]
          });
        });
      }
    });
  }
});
