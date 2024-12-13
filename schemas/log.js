// ./schemas/logConfig.js
const mongoose = require('mongoose');

const logConfigSchema = new mongoose.Schema({
    guildId: { type: String, required: true },
    logChannelId: { type: String, required: true },
    logAll: { type: Boolean, default: false },
    events: {
        banAdd: { type: Boolean, default: false },
        roleDelete: { type: Boolean, default: false },
        messageDelete: { type: Boolean, default: false },
        roleCreate: { type: Boolean, default: false },
        // Añadir más eventos según se necesiten
    }
});

module.exports = mongoose.model('LogConfig', logConfigSchema);
