makeEditable = function () {
  if (Router.current().route.getName() === 'edit') {
    $('.editable').attr('contenteditable', true);
    $('.editable').on('blur', function (event) {
      let value = event.currentTarget.innerText;
      let field = event.currentTarget.dataset.field;
      let prez = Presentations.findOne({ _id: Router.current().params.prez });
      check(value, String);
      check(field, String);
      if (prez && prez[field] !== value) {
        let update = {};
        update[field] = value;
        Presentations.update({ _id: Router.current().params.prez }, { $set: update });
        event.currentTarget.innerText = value;
        return true;
      }
      return false;
    });
  }
};
