Template.footer.helpers({
});

Template.footer.events({
  'click .previousSlide' () {
    let presentationId = Router.current().params.prez;
    if (presentationId) {
      Presentations.update({ _id: presentationId }, { $inc: { viewIndex: -1 }});
    }
  },
  'click .nextSlide' () {
    let presentationId = Router.current().params.prez;
    if (presentationId) {
      Presentations.update({ _id: presentationId }, { $inc: { viewIndex: 1 }});
    }
  },
});

Template.footer.onRendered(function () {
});
