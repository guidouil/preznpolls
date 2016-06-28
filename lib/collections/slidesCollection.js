Slides = new Mongo.Collection('slides');
Slides.allow({
  insert: function () {
    return true;
  },
  update: function () {
    return true;
  },
  remove: function () {
    return true;
  },
});
