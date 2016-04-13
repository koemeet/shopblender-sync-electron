import DS from 'ember-data';

export default DS.Model.extend({
    username: DS.attr('string'),
    plainPassword: DS.attr('string'),
    authorizationRoles: DS.hasMany('role', { async: false }),
    customer: DS.belongsTo('customer', { async: false }),
    enabled: DS.attr('boolean')
});
