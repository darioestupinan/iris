'use strict';
const request = require('superagent');
const config = require('../../config');

function getWeatherEndpoint(location, service){
    return `http://${service.ip}:${service.port}/service/${location}`;
}

module.exports.process = function process(intentData, sregistry, cb) {

    if (intentData.intent[0].value !== 'weather') {
        return cb(new Error(`Expected weather intent, got ${intentData.intent[0].value}`));
    }
    if (!intentData.location){
        return new cb(new Error('Missing location in weather intent'));
    }
    const location = intentData.location[0].value;
    const service = sregistry.get('weather');
    if (!service) {
        return cb(false, 'no service available');
    }
    request
        .get(getWeatherEndpoint(location, service), (err, res) => {
            if (err || res.statusCode !== 200 || !res.body.result) {
                console.log(err);
                return cb(false, `Had a problem finding out the weather in ${location}`);
            }

            return cb(false, `In ${location}, the weather is ${res.body.result}`);
        });
};