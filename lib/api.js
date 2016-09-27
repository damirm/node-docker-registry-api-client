'use strict';

const qs = require('querystring');
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
        const url = this._endpoint('_catalog') + '?' + qs.stringify({ n, last });

        return this._request({ url });
    }

    tags(name, { n, last }) {
        const url = this._endpoint(`${name}/tags/list`) + '?' + qs.stringify({ n, last });

        return this._request({ url });
    }

    manifest(name, reference = 'latest') {
        const url = this._endpoint(`${name}/manifests/${reference}`);

        return this._request({ url });
    }

    _endpoint(url) {
        return `${this.config.host}/${VERSION}/${url}`;
    }

    _request(options) {
        const params = Object.assign({}, {
            headers: {
                'Authorization': this.config.authorization
            }
        }, options);

        return new Promise((resolve, reject) => {
            request(options, (err, response, body) => {
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
