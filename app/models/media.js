import Ember from 'ember';
import DS from 'ember-data';

export default DS.Model.extend({
    workspace: DS.belongsTo('workspace', { async: false }),
    metadata: DS.attr('object'),
    theme: DS.belongsTo('theme', { inverse: 'assets' }),
    providerName: DS.attr('string'),
    name: DS.attr('string'),
    publicUrl: DS.attr('string'),
    url: DS.attr('string'),
    file: DS.attr('file')
});
