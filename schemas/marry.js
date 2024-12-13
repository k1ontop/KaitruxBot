const mongoose = require('mongoose');

const marriageSchema = new mongoose.Schema({
    userId1: { type: String, required: true },
    userId2: { type: String, required: true },
    marriedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Marriage', marriageSchema);
