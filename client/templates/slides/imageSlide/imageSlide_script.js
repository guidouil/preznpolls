Template.imageSlide.helpers({
});

Template.imageSlide.events({
  'change .slideColor' (event, tmpl) {
    let field = tmpl.find('#slideColorInput').value;
    let color = tmpl.find('#slideColor :selected').value;
    if (color === 'black') {
      color = 'basic';
    } else if (color) {
      color = 'inverted ' + color;
    }
    let query = {};
    query[field] = color;
    Presentations.update({ _id: Router.current().params.prez }, { $set: query });
  },
});

Template.imageSlide.onRendered(function () {
  makeEditable();
  $('.dropdown').dropdown();
});
