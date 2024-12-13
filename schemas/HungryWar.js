const mongoose = require('mongoose');

const hungryWarSchema = new mongoose.Schema({
    guildId: { type: String, required: true },
    channelId: { type: String, required: true },
    creatorId: { type: String, required: true },
    participants: { type: [String], default: [] },
    isStarted: { type: Boolean, default: false }
});

const HungryWar = mongoose.model('HungryWar', hungryWarSchema);

module.exports = HungryWar;
