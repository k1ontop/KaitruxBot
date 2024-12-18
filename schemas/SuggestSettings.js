const mongoose = require('mongoose');

const suggestSettingsSchema = new mongoose.Schema({
    guildId: {
        type: String,
        required: true,
        unique: true
    },
    channelId: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('SuggestSettings', suggestSettingsSchema);
