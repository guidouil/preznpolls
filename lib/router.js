Router.configure({
  layoutTemplate: 'main',
  notFoundTemplate: 'notFound',
  loadingTemplate: 'loading',
  templateNameConverter: 'camelCase',
  routeControllerNameConverter: 'camelCase',
});

Router.route('/', {
  name: 'home',
  title: 'Home',
});

Router.route('/p/:prez?', {
  name: 'play',
  title: 'Play',
});

Router.route('/e/:prez?', {
  name: 'edit',
  title: 'Edit',
});

Router.route('/v/:prez?/:chapter?/:slide?', {
  name: 'view',
  title: 'View',
});
