'use strict'

const { RTMClient } = require('@slack/client');
let rtm = null;
let nlp = null;

function handleOnAuthenticated(rtmStartData) {
    console.log(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}, but not connected to a channel`);
}

function addAuthenticatedHandler(rtm, handler) {
    rtm.on('authenticated', handler);
}

function handleOnMessage(message) {
    nlp.ask(message.text, (err, res) => {
        if (err) {
            console.log(err);
        }
        rtm.sendMessage('Sorry i did not understand', message.channel)
            .then((res) => {
            // `res` contains information about the posted message
            console.log('Message sent: ', res.ts);
            })
            .catch(console.error);
    });
}

// The client is initialized and then started to get an active connection to the platform
module.exports.init = function slackClient(token, logLevel, nlpClient) {
    rtm = new RTMClient(token, {logLevel: logLevel});
    nlp = nlpClient;
    addAuthenticatedHandler(rtm, handleOnAuthenticated);
    rtm.on('message', handleOnMessage);
    return rtm;
};

module.exports.addAuthenticatedHandler = addAuthenticatedHandler;
