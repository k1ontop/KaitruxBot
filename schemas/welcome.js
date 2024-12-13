const mongoose = require('mongoose');

const welcomeSchema = new mongoose.Schema({
    guildId: { type: String, required: true, unique: true },
    channelId: { type: String, required: true },
    message: { type: String, required: true },
    imageUrl: { type: String }
});

module.exports = mongoose.model('Welcome', welcomeSchema);
