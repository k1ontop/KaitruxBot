const mongoose = require('mongoose');

const ticketSetupSchema = new mongoose.Schema({
    guildId: { type: String, required: true },
    channelId: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    buttonEmoji: { type: String, required: true },
    roleId: { type: String, required: true },
    mentionMessage: { type: String }
});

module.exports = mongoose.model('TicketSetup', ticketSetupSchema);
