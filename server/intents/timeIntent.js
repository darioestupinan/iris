'use strict';
const request = require('superagent');
const config = require('../../config');

function getLocationEndPoint(location){
    return `${config.endpoints.irisTime}${location}`;
}

module.exports.process = function process(intentData, cb) {

    if (intentData.intent[0].value !== 'time') {
        return cb(new Error(`Expected time intent, got ${intentData.intent[0].value}`));
    }
    if (!intentData.location){
        return new cb(new Error('Missing location in time intent'));
    }
    const location = intentData.location[0].value;
    request
        .get(getLocationEndPoint(location), (err, res) => {
            if (err || res.statusCode !== 200 || !res.body.result) {
                console.log(err);
                console.log(res.body);

                return cb(false, `Had a problem finding out the time in ${location}`);
            }

            return cb(false, `In ${location}, it is now ${res.body.result}`);
        });
};