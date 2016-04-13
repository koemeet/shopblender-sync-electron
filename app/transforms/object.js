import DS from 'ember-data';
import Ember from 'ember';

export default DS.Transform.extend({
    deserialize: function (serialized) {
        return Ember.Object.create(serialized);
    },

    serialize: function (value) {
        if (value instanceof Ember.Object) {
            // delete circular references
            delete value.validations;
            delete value.container;
            delete value.type;

            return JSON.parse(JSON.stringify(value));
        } else if (!Ember.$.isPlainObject(value)) {
            return {};
        }

        return value;
    }
});
