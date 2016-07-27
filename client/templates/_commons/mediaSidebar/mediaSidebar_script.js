Template.mediaSidebar.onCreated(function () {
  let template = this;
  template.pexels = new ReactiveVar(false);
  template.giphy = new ReactiveVar(false);
  template.currentUpload = new ReactiveVar(false);
  Meteor.call('getPopularPexels', function (error, result) {
    if (error) {
      console.error(error);
    }
    if (result && result.statusCode === 200) {
      template.pexels.set(result.data.photos);
    }
  });
  Meteor.call('getPopularGiphy', function (error, result) {
    if (error) {
      console.error(error);
    }
    if (result && result.statusCode === 200) {
      template.giphy.set(result.data.data);
    }
  });
});

Template.mediaSidebar.helpers({
  pexels () {
    return Template.instance().pexels.get();
  },
  giphy () {
    return Template.instance().giphy.get();
  },
  currentUpload () {
    return Template.instance().currentUpload.get();
  },
});

Template.mediaSidebar.events({
  'click .searchPexels' () {
    let query = $('#searchPexels').val();
    let template = Template.instance();
    if (query) {
      Meteor.call('searchPexels', query, function (error, result) {
        if (error) {
          console.error(error);
        }
        template.pexels.set(result.data.photos);
      });
    }
  },
  'keyup #searchPexels': function(event) {
    if (event.which === 13) {
      event.stopPropagation();
      $('.searchPexels').click();
    }
  },
  'click .searchGiphy' () {
    let query = $('#searchGiphy').val();
    let template = Template.instance();
    if (query) {
      Meteor.call('searchGiphy', query, function (error, result) {
        if (error) {
          console.error(error);
        }
        template.giphy.set(result.data.data);
      });
    }
  },
  'keyup #searchGiphy': function(event) {
    if (event.which === 13) {
      event.stopPropagation();
      $('.searchGiphy').click();
    }
  },
  'click .pexel' () {
    let imageField = Session.get('imageField');
    Meteor.call('downloadImage', this.src.landscape, Router.current().params.prez, imageField, function () {
      $('.mediaSidebar').sidebar('hide');
    });
  },
  'click .giphy' () {
    let imageField = Session.get('imageField');
    Meteor.call('downloadImage', this.images.original.url, Router.current().params.prez, imageField, function () {
      $('.mediaSidebar').sidebar('hide');
    });
  },
  'click .uploadImage' (e) {
    $('input:file', $(e.target).parents()).click();
  },
  'change #imageInput' (e, template) {
    if (e.currentTarget.files && e.currentTarget.files[0]) {
      let name = e.currentTarget.files[0].name;
      $('.imageText', $(e.currentTarget).parent()).val(name);
      // We upload only one file, in case
      // multiple files were selected
      let upload = Images.insert({
        file: e.currentTarget.files[0],
        streams: 'dynamic',
        chunkSize: 'dynamic'
      }, false);

      upload.on('start', function () {
        template.currentUpload.set(this);
        $('#uploadProgress')
          .progress({
            duration: 200,
            total: 100,
          });
      });

      upload.on('end', function (error, fileRef) {
        if (error) {
          console.error('Error during upload: ' + error);
        } else {
          let imageField = Session.get('imageField');
          let query = {};
          query[imageField] = Meteor.absoluteUrl() + fileRef.path.replace('/data/', '');
          Presentations.update({ _id: Router.current().params.prez }, { $set: query });
        }
        template.currentUpload.set(false);
      });

      upload.start();
    }
  },
});

Template.mediaSidebar.onRendered(function () {
  $('.grid').isotope();
});
