// models/AutoMod.js
const mongoose = require('mongoose');

const autoModSchema = new mongoose.Schema({
    guildId: { type: String, required: true },
    level: { type: Number, default: 1 },
});

module.exports = mongoose.model('AutoMod', autoModSchema);
