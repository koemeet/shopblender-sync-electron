import Ember from 'ember';
import DS from 'ember-data';

var get = Ember.get;
var isNone = Ember.isNone;
var merge = Ember.merge;

export default DS.JSONAPISerializer.extend({
    keyForAttribute(key, method) {
        if (method === 'serialize') {
            return key;
        }
        return this._super(...arguments);
    },

    keyForRelationship: function (key, typeClass, method) {
        if (method === 'serialize') {
            return key;
        }
        return this._super(...arguments);
    },

    serialize(snapshot, options) {
        var json = {};

        if (options && options.includeId) {
            var id = snapshot.id;

            if (id) {
                json[get(this, 'primaryKey')] = id;
            }
        }

        snapshot.eachAttribute((key, attribute) => {
            this.serializeAttribute(snapshot, json, key, attribute);
        });

        snapshot.eachRelationship((key, relationship) => {
            if (relationship.kind === 'belongsTo') {
                this.serializeBelongsTo(snapshot, json, relationship);
            } else if (relationship.kind === 'hasMany') {
                this.serializeHasMany(snapshot, json, relationship);
            }
        });

        return json;
    },

    serializeAttribute(snapshot, json, key, attribute) {
        const type = attribute.type;

        if (this._canSerialize(key)) {
            let value = snapshot.attr(key);
            if (type) {
                const transform = this.transformFor(type);
                value = transform.serialize(value);
            }

            let payloadKey = this._getMappedKey(key, snapshot.type);

            if (payloadKey === key) {
                payloadKey = this.keyForAttribute(key, 'serialize');
            }

            json[payloadKey] = value;
        }
    },

    serializeBelongsTo: function (snapshot, json, relationship) {
        var key = relationship.key;

        if (this._canSerialize(key)) {
            var belongsTo = snapshot.belongsTo(key);
            if (belongsTo !== undefined) {
                var payloadKey = this._getMappedKey(key, snapshot.type);
                if (payloadKey === key) {
                    payloadKey = this.keyForRelationship(key, 'belongsTo', 'serialize');
                }

                let data = null;

                if (isNone(belongsTo)) {
                    data = null;
                } else if (belongsTo.id) {
                    if (belongsTo.record.get('path')) {
                        data = belongsTo.record.get('path');
                    } else {
                        data = belongsTo.id;
                    }
                } else {
                    data = belongsTo.serialize();
                }

                json[payloadKey] = data;
            }
        }
    },

    serializeHasMany: function (snapshot, json, relationship) {
        var key = relationship.key;

        if (this._shouldSerializeHasMany(snapshot, key, relationship)) {
            var hasMany = snapshot.hasMany(key);
            if (hasMany !== undefined) {
                var payloadKey = this._getMappedKey(key, snapshot.type);
                if (payloadKey === key && this.keyForRelationship) {
                    payloadKey = this.keyForRelationship(key, 'hasMany', 'serialize');
                }

                json[payloadKey] = [];

                if (key === 'translations') {
                    json[payloadKey] = {};

                    hasMany.forEach((item) => {
                        json[payloadKey][item.attr('locale')] = item.serialize();
                    });
                } else {
                    json[payloadKey] = hasMany.map((item) => {
                        if (item.id && relationship.type !== 'tag') {
                            if (item.record.get('path')) {
                                return item.record.get('path');
                            }
                            return item.id;
                        }
                        return item.serialize();
                    });
                }
            }
        }
    },

    serializeIntoHash(data, type, snapshot, options) {
        merge(data, this.serialize(snapshot, options));
    }
});
