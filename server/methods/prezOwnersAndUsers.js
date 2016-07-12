Meteor.methods({
  getPrezOwnersAndUsers: function (prezId) {
    if (this.userId) {
      check(prezId, String);
      if (isPrezOwner(prezId, this.userId)) {
        let prez = Presentations.findOne({_id: prezId});
        let owners = [];
        _.each(prez.owners, function (ownerId) {
          let owner = Meteor.users.findOne({_id: ownerId});
          owners.push({
            userId: ownerId,
            email: contactEmail(owner),
          });
        });
        let users = [];
        if (prez.users) {
          _.each(prez.users, function (userId) {
            let user = Meteor.users.findOne({_id: userId});
            users.push({
              userId: userId,
              email: contactEmail(user),
            });
          });
        }
        return {'owners': owners, 'users': users};
      }
    }
    return false;
  },
  giveOrwnership: function (email, prezId) {
    if (this.userId) {
      check(email, String);
      check(prezId, String);
      if (isPrezOwner(prezId, this.userId)) {
        let owner = Meteor.users.findOne({ $or: [
          { 'emails.address': email },
          { 'user.services.facebook.email': email },
          { 'user.services.google.email': email },
        ]});
        if (owner) {
          Presentations.update({_id: prezId}, {$addToSet: {
            owners: owner._id,
          }});
          return true;
        }
      }
    }
    return false;
  },
  removeOwnership: function (ownerId, prezId) {
    if (this.userId) {
      check(ownerId, String);
      check(prezId, String);
      if (isPrezOwner(prezId, this.userId)) {
        Presentations.update({_id: prezId}, {$pull: {
          owners: ownerId,
        }});
        return true;
      }
    }
    return false;
  },
  addUser: function (email, prezId) {
    if (this.userId) {
      check(email, String);
      check(prezId, String);
      if (isPrezOwner(prezId, this.userId)) {
        let user = Meteor.users.findOne({ $or: [
          { 'emails.address': email },
          { 'user.services.facebook.email': email },
          { 'user.services.google.email': email },
        ]});
        if (user) {
          Presentations.update({_id: prezId}, {$addToSet: {
            users: user._id,
          }});
          return true;
        }
      }
    }
    return false;
  },
  removeUser: function (userId, prezId) {
    if (this.userId) {
      check(userId, String);
      check(prezId, String);
      if (isPrezOwner(prezId, this.userId)) {
        Presentations.update({_id: prezId}, {$pull: {
          users: userId,
        }});
        return true;
      }
    }
    return false;
  },
});
