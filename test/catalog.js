'use strict';

const assert = require('assert');

assert(process.env.TOKEN, 'empty TOKEN env variable');

const Api = require('../index');

const client = new Api({
    host: 'registry.yandex.net',
    authorization: `OAuth ${process.env.TOKEN}`,
});

client.catalog({})
    .then(consoleLogBody('catalog'))
    .then(() => {
        return client.tags('tools/tanker-www', {});
    })
    .then(consoleLogBody('tags'))
    .then(() => {
        return client.manifest('tools/tanker-www');
    })
    .then((result) => console.log(JSON.stringify(result)));

function consoleLogBody(method) {
    return result => console.log(`${method} response`, result.body);
}

// client.deleteImage('tools/doccenter-previewer', '1.0.5')
//     .then(result => console.log(result.body));