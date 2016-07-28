Images = new FilesCollection({
  storagePath: '/data/uploads/',
  downloadRoute: '/uploads',
  collectionName: 'Images',
  allowClientCode: true, // Allow remove files from Client
  onBeforeUpload: function (file) {
    // Allow upload files under 10MB, and only in png/jpg/jpeg formats
    if (file.size <= 10485760 && /png|jpg|jpeg/i.test(file.extension)) {
      return true;
    }
    return 'Please upload image, with size equal or less than 10MB';
  },
  onBeforeRemove: function () {
    if (this.userId) {
      return true;
    }
    return false;
  },
});
