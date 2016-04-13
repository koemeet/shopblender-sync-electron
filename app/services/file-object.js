import Ember from 'ember';

export default Ember.Service.extend({
    fromBuffer(buffer, name, mimeType) {
        let byteArray = new Uint8Array(buffer);
        let blob = new Blob([byteArray]);

        return new File([blob], name, { type: mimeType });
    }
});
