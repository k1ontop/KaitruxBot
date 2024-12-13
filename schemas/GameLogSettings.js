const mongoose = require('mongoose');

const gameLogSettingsSchema = new mongoose.Schema({
    guildId: { type: String, required: true },
    events: { type: Map, of: String, required: true }
});

const GameLogSettings = mongoose.model('GameLogSettings', gameLogSettingsSchema);

module.exports = GameLogSettings;
