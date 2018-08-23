'use strict';

const request = require("superagent");
const config = require('../config');

function handleWitResponse(res) {
    return res.entities;
}

module.exports = function witClient(token) {
    const ask = function ask(message, cb) {

        request.get(config.endpoints.apiWit)
            .set("Authorization", "Bearer " + token)
            .query({v: "20180818", q: message})
            .end((err, res) => {
                if (err) {
                    return cb(err);
                }
                if (res.statusCode !== 200){
                    return cb('Expected status 200 but got ' + res.statusCode);
                }

                const witResponse = handleWitResponse(res.body);
                return cb(null, witResponse);
            });
    };

    return {
        ask: ask
    };
};
