import Ember from 'ember';
import DS from 'ember-data';

export default DS.Model.extend({
    theme: DS.belongsTo('theme'),
    name: DS.attr('string'),
    source: DS.attr('string')
});
