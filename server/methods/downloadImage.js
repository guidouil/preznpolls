Meteor.methods({
  'downloadImage': function (url, prezId, imageField) {
    if (this.userId) {
      check(url, String);
      check(prezId, String);
      check(imageField, String);
      let userId = this.userId;
      if (isPrezOwner(prezId, userId)) {
        Images.load(url, function (error, fileRef) {
          let query = {};
          query[imageField] = Meteor.absoluteUrl() + fileRef.path.replace('/data/', '');
          Presentations.update({ _id: prezId }, { $set: query });
          // Image owner
          Images.update({ _id: fileRef._id }, { $set: {
            userId: userId,
          }});
          return true;
        });
      }
    }
    return false;
  },
});
