let Highcharts = require('highcharts');

Template.barStat.helpers({
  totalVotes () {
    return Session.get('totalVotes');
  },
});

Template.barStat.events({
  'click .backToPoll' () {
    Session.delete('currentStat');
  },
});

Template.barStat.onRendered(function () {
  let voteId = Session.get('currentVoteId');
  let prezId = Router.current().params.prez;
  if (voteId) {
    Tracker.autorun(function () {
      let votes = Votes.findOne({ _id: prezId + '_' + voteId });
      if (votes) {
        delete votes._id;
        Session.set('totalVotes', votes.totalVotes);
        delete votes.totalVotes;
        let votesData = [];
        let votesCateg = [];
        _.each(votes, function(pointsCount, voteLabel) {
          votesCateg.push(voteLabel);
          let rateTotal = 0;
          _.each( pointsCount, function(voteCount, index) {
            rateTotal = rateTotal + (voteCount * index);
          });
          let voteAverage = rateTotal / totalVotes;
          votesData.push(Math.round(voteAverage * 100) / 100);
        });

        $(function () {
          $('#barChart').highcharts({
            chart: {
              type: 'bar',
            },
            title: {
              text: 'Average rating for ' + totalVotes + ' votes',
            },
            xAxis: {
              categories: votesCateg,
              title: {
                text: null,
              },
            },
            yAxis: {
              min: 0,
              title: {
                text: null,
              },
            },
            tooltip: {
              valueSuffix: '',
            },
            plotOptions: {
              bar: {
                dataLabels: {
                  enabled: true,
                },
              },
            },
            credits: {
              enabled: false,
            },
            series: [{
              name: 'Average rating',
              data: votesData,
            }],
          });
        });
      }
    });
  }
});
