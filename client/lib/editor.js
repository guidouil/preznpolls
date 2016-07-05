makeEditable = function () {
  if (Router.current().route.getName() === 'edit') {
    $('.editable').attr('contenteditable', true);
    $('.editable').on('blur', function (event) {
      let value = event.currentTarget.innerText;
      let field = event.currentTarget.dataset.field;
      check(value, String);
      check(field, String);
      let update = {};
      update[field] = value;
      Presentations.update({ _id: Router.current().params.prez }, { $set: update });
    });
  }
  return false;
};
