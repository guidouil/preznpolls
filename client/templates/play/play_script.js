Template.play.helpers({
  dynamicTemplate () {
    if (Session.get('currentStat')) {
      return Session.get('currentStat');
    }
    let presentationId = Router.current().params.prez;
    let presentation = Presentations.findOne({_id: presentationId});
    if (presentation && presentation.slides.length > 0) {
      // infinite loop forward
      if (presentation.viewIndex >= presentation.slides.length) {
        Presentations.update({ _id: presentationId },
          { $set: { viewIndex: 0 }}
        );
      }
      // infinite loop backward
      if (presentation.viewIndex < 0) {
        Presentations.update({ _id: presentationId },
          { $set: { viewIndex: presentation.slides.length - 1 }}
        );
      }
      return presentation.slides[presentation.viewIndex];
    }
    return 'coverSlide'; // Default fallback
  },
});

Template.play.events({
});

Template.play.onRendered(function () {
});
