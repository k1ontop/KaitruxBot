const mongoose = require('mongoose');

const disabledCommandsSchema = new mongoose.Schema({
    guildId: { type: String, required: true },
    channelId: { type: String, default: null }, // Null si es para todo el servidor
    command: { type: String, required: true },
});

module.exports = mongoose.model('DisabledCommand', disabledCommandsSchema);
