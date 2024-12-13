const mongoose = require('mongoose');

const vanitySchema = new mongoose.Schema({
    guildId: { type: String, required: true },
    vanityUrl: { type: String, required: true },
    roleId: { type: String, required: true },
});

module.exports = mongoose.model('Vanity', vanitySchema);
