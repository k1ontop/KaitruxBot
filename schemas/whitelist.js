// models/Whitelist.js
const mongoose = require('mongoose');

const whitelistSchema = new mongoose.Schema({
    guildId: String,
    userId: String,
    permissions: [String],
});

module.exports = mongoose.model('Whitelist', whitelistSchema);
