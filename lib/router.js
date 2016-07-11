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

Router.route('/play/:prez', {
  name: 'play',
  title: 'Play',
});

Router.route('/edit/:prez', {
  name: 'edit',
  title: 'Edit',
});

Router.route('/settings/:prez', {
  name: 'settings',
  title: 'Settings',
});

Router.route('/view/:prez/:chapter/:slide', {
  name: 'view',
  title: 'View',
});
