import DS from 'ember-data';

export default DS.Model.extend({
    workspace: DS.belongsTo('workspace'),
    user: DS.belongsTo('user', { dependent: true }),
    
    email: DS.attr('string'),
    firstName: DS.attr('string'),
    lastName: DS.attr('string'),
    birthDay: DS.attr('date'),
    gender: DS.attr('string', {
        defaultValue: 'u'
    }),
    enabled: DS.attr('boolean', {
        defaultValue: true
    }),
    createdAt: DS.attr('date'),
    updatedAt: DS.attr('date'),

    fullName: function () {
        if (this.get('firstName') || this.get('lastName')) {
            return (this.get('firstName') || '') + ' ' + (this.get('lastName') || '');
        } else {
            return this.get('email') || '-';
        }
    }.property('firstName', 'lastName', 'email')
});
