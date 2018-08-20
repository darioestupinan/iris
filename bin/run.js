'use strict';

const slackClient = require('../server/slackClient');
const service = require('../server/service');
const http = require('http');

const server = http.createServer(service);
const config = require('../config');

const SLACK_TOKEN = config.slackToken;
const WIT_TOKEN = config.witToken;

const witClient = require("../server/witClient")(WIT_TOKEN);

const LOG_LEVEL = "info";

const rtm = slackClient.init(SLACK_TOKEN, LOG_LEVEL, witClient);
rtm.start();
slackClient.addAuthenticatedHandler(rtm, () => {
    server.listen(3000);
});

server.on('listening', function () {
    console.log(`IRIS is listening on ${server.address().port} in ${service.get('env')} mode.`)
});
