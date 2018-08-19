'use strict';

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
            console.log("error: " + err);
            return;
        }

        if (!res.intent){
            return rtm.sendMessage("sorry i don't understand", message.channel);
        } else if(res.intent[0].value === 'time' && res.location){
            return rtm.sendMessage(`i don't know the time yet in ${res.location[0].value}`, message.channel, function () {});
        } else  {
            console.log(res);
            return rtm.sendMessage("sorry something happened", message.channel);
        }
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
