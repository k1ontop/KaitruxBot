const mongoose = require('mongoose');

const autoResponseSchema = new mongoose.Schema({
    guildId: { type: String, required: true },
    trigger: { type: String, required: true },
    response: { type: String, required: true }
});

module.exports = mongoose.model('AutoResponse', autoResponseSchema);
