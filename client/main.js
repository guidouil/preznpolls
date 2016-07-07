Template.registerHelper('toLowerCase', function (string) {
  check(string, String);
  return string.toLowerCase();
});

Template.registerHelper('capitalize', function (string) {
  check(string, String);
  return string.charAt(0).toUpperCase() + string.slice(1);
});

Template.registerHelper('isEditing', function () {
  return Router.current().route.getName() === 'edit';
});

Template.registerHelper('isEditingOr', function (value) {
  return value || Router.current().route.getName() === 'edit';
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


Template.registerHelper('isSelectedColor', function (color, value) {
  if (color && value && (color === value || color.search(value) !== -1)) {
    return 'selected';
  }
  return '';
});

Template.registerHelper('colors', function() {
  return ['black', 'red', 'orange', 'yellow', 'olive', 'green', 'teal', 'blue', 'purple', 'violet', 'pink', 'brown', 'grey'];
});

Template.registerHelper('plural', function (number) {
  if (number > 1) {
    return 's';
  }
  return '';
});
