const mongoose = require('mongoose');

const blacklistSchema = new mongoose.Schema({
    guildId: String,
    words: [String],
});

module.exports = mongoose.model('Blacklist', blacklistSchema);
