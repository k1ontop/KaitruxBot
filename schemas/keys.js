const mongoose = require('mongoose');

const premiumKeyySchema = new mongoose.Schema({
    key: { type: String, required: true, unique: true },
    guildId: { type: String, default: null },
    redeemedAt: { type: Date, default: null }
});

module.exports = mongoose.model('keys', premiumKeyySchema);
