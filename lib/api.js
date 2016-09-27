'use strict';

const request = require('request');
const Promise = require('bluebird');

const VERSION = 'v2';

const defaults = {
    protocol: 'https',
    host: 'index.docker.io',
    authorization: ''
};

class Api {
    constructor(config) {
        this.config = Object.assign({}, defaults, config);
    }

    catalog({ n, last }) {
        const url = this._endpoint('_catalog');
        const qs = { n, last };

        return this._request({ url, qs });
    }

    tags(name, { n, last }) {
        const url = this._endpoint(`${name}/tags/list`);
        const qs = { n, last };

        return this._request({ url, qs });
    }

    manifest(name, reference = 'latest') {
        const url = this._endpoint(`${name}/manifests/${reference}`);

        return this._request({ url });
    }

    deleteImage(name, reference) {
        const url = this._endpoint(`${name}/manifest/${reference}`);

        return this._request({
            url,
            method: 'DELETE'
        });
    }

    _endpoint(url) {
        return `${this.config.protocol}://${this.config.host}/${VERSION}/${url}`;
    }

    _request(options) {
        const params = Object.assign({}, {
            headers: {
                'Authorization': this.config.authorization
            },
            json: true
        }, options);

        return new Promise((resolve, reject) => {
            request(params, (err, response, body) => {
                if (err) {
                    return reject(err);
                }

                resolve({
                    response,
                    body
                });
            });
        })
    }
}

module.exports = Api;
