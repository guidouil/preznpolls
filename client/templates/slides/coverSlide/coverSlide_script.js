Template.coverSlide.helpers({
});

Template.coverSlide.events({
  'change .slideColor' (event, tmpl) {
    let field = tmpl.find('#slideColorInput').value;
    let color = tmpl.find('#slideColor :selected').value;
    if (color === 'white') {
      color = 'basic';
    } else if (color === 'black') {
      color = 'inverted';
    } else if (color) {
      color = 'inverted ' + color;
    }
    let query = {};
    query[field] = color;
    Presentations.update({ _id: Router.current().params.prez }, { $set: query });
  },
});

Template.coverSlide.onRendered(function () {
  makeEditable();
  $('.dropdown').dropdown();
});
