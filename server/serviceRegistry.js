'use strict';

const moment = require('moment');
const config = require('../config');

class ServiceRegistry {

    constructor () {
        this._services = [];
        this._timeout = config.registryTimeout;
    }

    add(intent, ip, port) {
        const key = intent+ip+port;

        if (!this._services[key]) {
            this._services[key] = {
                timestamp: new moment(),
                ip: ip,
                port: port,
                intent: intent
            };

        }
        else {
            this._services[key].timestamp = new moment();
        }
        console.log(`service for ${JSON.stringify(this._services[key])}`);
        this._cleanup();
    }

    remove(intent, ip, port) {
        const key = intent+ip+port;

        delete this._services[key];
    }

    get(intent) {
        this._cleanup();

        for(let key in this._services) {
            if (this._services[key].intent === intent){
                return this._services[key];
            }

        }
        return null;
    }

    _cleanup() {
        const now = new moment();

        for(let key in this._services) {
            if (this._services[key].timestamp.add(this._timeout, 's') < now){
                console.log(`removed services for intent ${JSON.stringify(this._services[key])}`);
                delete this._services[key];
            }
        }
    }
}

module.exports = ServiceRegistry;