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

Router.route('/play/:prez?/:chapter?/:page?', {
  name: 'play',
  title: 'Play',
});

Router.route('/edit/:prez?/:chapter?/:page?', {
  name: 'edit',
  title: 'Edit',
});

Router.route('/view/:prez?', {
  name: 'view',
  title: 'View',
});
