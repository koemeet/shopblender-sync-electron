import DS from 'ember-data';

export default DS.Model.extend({
    workspace: DS.belongsTo('workspace'),

    assets: DS.hasMany('media', { inverse: 'theme' }),
    templates: DS.hasMany('template'),
    schema: DS.attr('string'),

    parents: DS.hasMany('theme', { inverse: null }),
    children: DS.hasMany('theme', { inverse: null }),

    name: DS.attr('string'),

    description: DS.attr('string'),
    createdAt: DS.attr('date'),
    boughtAt: DS.attr('date'),
    demoWebsite: DS.attr('string'),
    inStore: DS.attr('boolean', { readOnly: true }),
    price: DS.attr('number'),

    isCustom: function () {
        return this.get('workspace.id') ? true : false;
    }.property('workspace.id')
});
