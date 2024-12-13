// models/BlockedUser.js
const mongoose = require('mongoose');

const blockedUserSchema = new mongoose.Schema({
    blockerId: { type: String, required: true },
    blockedId: { type: String, required: true },
});

module.exports = mongoose.model('BlockedUser', blockedUserSchema);
