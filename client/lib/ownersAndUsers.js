isPrezOwner = function (prezId, userId) {
  check(prezId, String);
  check(userId, String);
  // check if given userId is one of the prez owners
  let prez = Presentations.findOne({_id: prezId});
  if (prez && prez.owners && prez.owners.length >= 1) {
    if (_.contains(prez.owners, userId)) {
      return true;
    }
  }
  return false;
};

isPageUser = function (prezId, userId) {
  check(prezId, String);
  check(userId, String);
  // check if given userId is one of the prez users
  let prez = Presentations.findOne({_id: prezId});
  if (prez && prez.sellers && prez.users.length >= 1) {
    if (_.contains(prez.users, userId)) {
      return true;
    }
  }
  return false;
};
