Template.registerHelper('toLowerCase', function (string) {
  check(string, String);
  return string.toLowerCase();
});
