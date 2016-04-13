import Ember from 'ember';
import Resolver from './resolver';
import loadInitializers from 'ember-load-initializers';
import config from './config/environment';
import Inflector from 'ember-inflector';

let App;

Ember.MODEL_FACTORY_INJECTIONS = true;

App = Ember.Application.extend({
  modulePrefix: config.modulePrefix,
  podModulePrefix: config.podModulePrefix,
  Resolver
});

Inflector.inflector.uncountable('media');
Inflector.inflector.uncountable('metadata');

loadInitializers(App, config.modulePrefix);

export default App;
