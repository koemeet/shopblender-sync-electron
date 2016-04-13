import Ember from 'ember';
import DS from 'ember-data';
import ENV from 'shopblender-sync/config/environment';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';

export default DS.JSONAPIAdapter.extend(DataAdapterMixin, {
    authorizer: 'authorizer:oauth2',
    namespace: 'api',

    init() {
        this._super(...arguments);

        if (ENV.APP.API.host) {
            this.set('host', 'http://' + ENV.APP.API.host);
        }
    },

    urlForFindRecord(id, modelName, snapshot) {
        let url = this._super(...arguments);
        let query = Ember.get(snapshot, 'adapterOptions.query');
        if (query) {
            url += '?' + Ember.$.param(query); // assumes no query params are present already
        }
        return url;
    }
});
