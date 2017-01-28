'use strict';

const request = require('request');
const Promise = require('bluebird');
const _ = require('lodash');

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
        return this._manifest(name, {}, reference);
    }

    _manifest(name, options, reference) {
        options.url = this._endpoint(`${name}/manifests/${reference}`);

        return this._request(options);
    }

    deleteImage(name, reference = 'latest') {
        return this._manifest(name, {json: false}, reference).then(response => {
            const digest = response.response.headers['docker-content-digest'];
            const url = this._endpoint(`${name}/manifests/${digest}`);

            if (!digest) {
                return Promise.reject(new Error('Digest not found!'))
            }

            return this._request({
                url,
                method: 'DELETE'
            });
        })
    }

    _endpoint(url) {
        return `${this.config.protocol}://${this.config.host}/${VERSION}/${url}`;
    }

    _request(options) {
        const params = _.merge({}, {
            headers: {
                'Authorization': this.config.authorization,
                Accept: 'application/vnd.docker.distribution.manifest.v2+json'
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
