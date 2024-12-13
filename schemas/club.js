const mongoose = require('mongoose');

const clubSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    ownerId: { type: String, required: true },
    members: { type: [String], default: [] },
    invites: { type: [String], default: [] }
});

module.exports = mongoose.model('Club', clubSchema);
