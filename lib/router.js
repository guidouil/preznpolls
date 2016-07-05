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

Router.route('/play/:prez?/:chapter?/:slide?', {
  name: 'play',
  title: 'Play',
});

Router.route('/edit/:prez?/:chapter?/:slide?', {
  name: 'edit',
  title: 'Edit',
});

Router.route('/view/:prez?', {
  name: 'view',
  title: 'View',
});
