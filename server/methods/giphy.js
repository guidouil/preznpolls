let Giphy = {};

Giphy.k = '3o6Zt1qkTxX6ARlPTu'.replace(/T/g, 'F');

Meteor.methods({
  getPopularGiphy: function () {
    return HTTP.get('http://api.giphy.com/v1/gifs/trending?api_key=' + Giphy.k);
  },
  searchGiphy: function (query) {
    check(query, String);
    return HTTP.get('http://api.giphy.com/v1/gifs/search?q=' + encodeURIComponent(query) + '&api_key=' + Giphy.k);
  },
});
