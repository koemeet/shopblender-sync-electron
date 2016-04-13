import DS from 'ember-data';

export default DS.Model.extend({
    name: DS.attr('string'),
    themes: DS.hasMany('theme')
});
