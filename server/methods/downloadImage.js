Meteor.methods({
  'downloadImage': function (url, prezId, imageField) {
    Images.load(url, function (error, fileRef) {
      let query = {};
      console.log(fileRef);
      query[imageField] = Meteor.absoluteUrl() + fileRef.path.replace('/data/', '');
      Presentations.update({ _id: prezId }, { $set: query });
      return true;
    });
  },
});
