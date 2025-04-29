const EventEmitter = require('events');

class BeatlyEmitter extends EventEmitter {}

const beatlyEmitter = new BeatlyEmitter();

module.exports = beatlyEmitter;
