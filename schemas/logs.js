const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    guildId: { type: String, required: true },
    userId: { type: String, required: true },
    action: { type: String, required: true },
    details: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Log', logSchema);
