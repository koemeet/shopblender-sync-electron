import Ember from 'ember';
const sane = require('sane');

export default Ember.Controller.extend({
    session: Ember.inject.service('session'),

    init() {
        this._super(...arguments);
    },

    actions: {
        invalidateSession() {
            this.get('session').invalidate();
        }
    }
});
