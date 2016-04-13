import Ember from 'ember';

const { computed } = Ember;

export default Ember.Controller.extend({
    parents: computed(function () {
        return this.get('store').query('theme', {
            criteria: {
                workspace: null
            }
        });
    }),

    actions: {
        cancel() {
            this.transitionToRoute('index');
        },

        save() {
            this.get('model').save().then(() => {
                this.transitionToRoute('index');
            });
        }
    }
});
