import Ember from 'ember';

export default Ember.Mixin.create({
    formDataTypes: ['POST', 'PATCH'],

    ajaxOptions: function (url, type, options) {
        var data;

        if (options && 'data' in options) {
            data = options.data;
        }

        var hash = this._super.apply(this, arguments);

        if (typeof FormData !== 'undefined' && data && this.formDataTypes.indexOf(type) >= 0) {
            hash.processData = false;
            hash.contentType = false;
            hash.data = this._getFormData(data);
        }

        return hash;
    },

    ajax(url, method, options) {
        if ('PATCH' === method) {
            url += '?_method=PATCH';
            method = 'POST';
        }

        return this._super(url, method, options);
    },

    _getFormData: function (data) {
        var formData = new FormData();

        let output = this._flatten(data);
        Object.keys(output).forEach((key) => {
            formData.append(key, output[key]);
        });

        return formData;
    },

    _flatten(target) {
        var output = {};

        function step(object, prev) {
            Object.keys(object).forEach(function (key) {
                var value = object[key];
                var newKey = prev ? prev + '[' + key + ']' : key;

                if (value instanceof Object && Object.keys(value).length) {
                    return step(value, newKey);
                }

                if (value instanceof Object && Object.prototype.toString.call(value) !== '[object File]') {
                    return;
                }

                if (value) {
                    output[newKey] = value;
                }
            });
        }

        step(target);

        return output;
    }
});
