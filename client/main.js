Template.registerHelper('toLowerCase', function (string) {
  check(string, String);
  return string.toLowerCase();
});

Template.registerHelper('isEditing', function () {
  return Router.current().route.getName() === 'edit';
});

Template.registerHelper('currentIndexes', function (chapterOrSlide) {
  let prez = Presentations.findOne({ _id: Router.current().params.prez });
  if (prez) {
    if (chapterOrSlide === 'chapter') {
      return prez.chapterViewIndex;
    }
    return prez.slideViewIndex;
  }
  return 0;
});
