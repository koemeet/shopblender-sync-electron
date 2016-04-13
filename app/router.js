import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function () {
  this.route('login');
  this.route('index', { path: '/' }, function() {
    this.route('add-theme');
  })
});

export default Router;
