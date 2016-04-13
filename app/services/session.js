import Ember from 'ember';
import Session from 'ember-simple-auth/services/session';

const { computed } = Ember;

export default Session.extend({
    store: Ember.inject.service(),

    user: computed(function() {
        return this.get('store').findRecord('user', '@me', { include: 'workspace' });
    })
});
