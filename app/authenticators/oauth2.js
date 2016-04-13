import OAuth2PasswordGrant from 'ember-simple-auth/authenticators/oauth2-password-grant';
import ENV from 'shopblender-sync/config/environment';

export default OAuth2PasswordGrant.extend({
    serverTokenEndpoint: ENV.APP.API.tokenEndpoint,

    makeRequest: function(url, data) {
        data.client_id = ENV.APP.API.clientId;
        data.client_secret = ENV.APP.API.clientSecret;
        return this._super(...arguments);
    }
});
