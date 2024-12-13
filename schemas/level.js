const mongoose = require('mongoose');

const levelSchema = new mongoose.Schema({
    guildId: { type: String, required: true },
    userId: { type: String, required: true },
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 }
});

module.exports = mongoose.model('Level', levelSchema);
