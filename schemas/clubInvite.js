const mongoose = require('mongoose');

const clubInviteSchema = new mongoose.Schema({
    clubId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Club' },
    userId: { type: String, required: true },
    invitedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ClubInvite', clubInviteSchema);
