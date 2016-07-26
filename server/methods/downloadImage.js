Meteor.methods({
  'downloadImage': function (url, prezId, imageField) {
    Images.load(url, function (error, fileRef) {
      let query = {};
      query[imageField] = Images.link(fileRef);
      Presentations.update({ _id: prezId }, { $set: query });
      return true;
    });
  },
});
