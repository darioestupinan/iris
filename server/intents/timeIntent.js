'use strict';
const request = require('superagent');
const config = require('../../config');

function getLocationEndPoint(location, service){
    return `http://${service.ip}:${service.port}/service/${location}`;
}

module.exports.process = function process(intentData, sregistry, cb) {

    if (intentData.intent[0].value !== 'time') {
        return cb(new Error(`Expected time intent, got ${intentData.intent[0].value}`));
    }
    if (!intentData.location){
        return new cb(new Error('Missing location in time intent'));
    }
    const location = intentData.location[0].value;
    const service = sregistry.get('time');
    if (!service) {
        return cb(false, 'no service available');
    }
    request
        .get(getLocationEndPoint(location, service), (err, res) => {
            if (err || res.statusCode !== 200 || !res.body.result) {
                console.log(err);
                return cb(false, `Had a problem finding out the time in ${location}`);
            }

            return cb(false, `In ${location}, it is now ${res.body.result}`);
        });
};