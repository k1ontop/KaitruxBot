const mongoose = require('mongoose');

const memberActivitySchema = new mongoose.Schema({
    guildId: { type: String, required: true },
    userId: { type: String, required: true },
    events: [
        {
            type: { type: String, enum: ['join', 'leave', 'roleChange'], required: true },
            timestamp: { type: Date, default: Date.now },
            roles: [String]
        }
    ]
});

module.exports = mongoose.model('MemberActivity', memberActivitySchema);
