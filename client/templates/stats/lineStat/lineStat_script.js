Template.lineStat.helpers({

});

Template.lineStat.events({
  'click .backToPoll' () {
    Session.delete('currentStat');
  },
});

Template.lineStat.onRendered(function () {
  let voteId = Session.get('currentVoteId');
  let prezId = Router.current().params.prez;
  if (voteId) {
    Tracker.autorun(function () {
      let votes = Votes.findOne({ _id: prezId + '_' + voteId });
      if (votes) {
        console.log(votes);
        let votesData = [];
        _.each(votes, function( values, name) {
          if (! _.contains(['totalVotes', '_id'], name)) {
            votesData.push({
              'name': name,
              'data': values,
            });
          }
        });

        $(function () {
          $('#lineChart').highcharts({
            title: {
                text: 'Ranges for ' + votes.totalVotes + 'voters',
                x: -20 //center
            },

            xAxis: {
                categories: ['0', '1', '2', '3', '4', '5',
                    '6', '7', '8', '9', '10']
            },
            yAxis: {
                title: {
                    text: 'Votes'
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            tooltip: {
                valueSuffix: ' votes'
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle',
                borderWidth: 0
            },
            series: votesData
          });
        });
      }
    });
  }
});
