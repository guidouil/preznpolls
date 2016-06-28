Template.play.helpers({
  dynamicTemplate () {
    let presentationId = Router.current().params.prez;
    let presentation = Presentations.findOne({_id: presentationId});
    if (presentation && presentation.slides.length > 0) {
      if (presentation.viewIndex >= presentation.slides.length) {
        Presentations.update({ _id: presentationId }, { $set: { viewIndex: 0 }});
      }
      if (presentation.viewIndex < 0) {
        Presentations.update({ _id: presentationId }, { $set: { viewIndex: presentation.slides.length - 1 }});
      }
      return presentation.slides[presentation.viewIndex];
    }
    return 'coverSlide';
  },
});

Template.play.events({
});

Template.play.onRendered(function () {
});
