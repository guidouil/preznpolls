let Pexels = {};

Pexels.k = '563492ad6f917cccc1ccccc16d9785c67b444aa273f27dc388ceff5c'.replace(/c/g, '0');

Pexels.request = function () {
  return {
    headers: {
      'Authorization': Pexels.k,
    },
  };
};

Meteor.methods({
  getPopularPexels: function (page) {
    page = page || 1;
    check(page, Number);
    return HTTP.get('http://api.pexels.com/v1/popular?per_page=21&page=' + page, Pexels.request());
  },
  searchPexels: function (query, page) {
    check(query, String);
    page = page || 1;
    check(page, Number);
    return HTTP.get('http://api.pexels.com/v1/search?query=' + encodeURIComponent(query) + '&per_page=15&page=' + page, Pexels.request());
  },
});
