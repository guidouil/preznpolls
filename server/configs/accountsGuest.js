AccountsGuest.anonymous = true;

let everyMidnight = new Cron(function() {
  /* clean out all guest accounts more than 24 hours old (default behavior) */
  Accounts.removeOldGuests();
}, {
  minute: 0,
  hour: 0,
});
