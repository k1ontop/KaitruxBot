const mongoose = require('mongoose');

const logSettingsSchema = new mongoose.Schema({
    guildId: { type: String, required: true },
    events: {
        channelCreate: { type: String, default: null },
        channelUpdate: { type: String, default: null },
        guildBanAdd: { type: String, default: null },
        guildMemberAdd: { type: String, default: null },
        guildMemberRemove: { type: String, default: null },
        messageDelete: { type: String, default: null }
    }
});

module.exports = mongoose.model('LogSettings', logSettingsSchema);
