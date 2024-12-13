const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    club: { type: String, default: "Sin club" },
    phrase: { type: String, default: "Ninguna" },
    maritalStatus: { type: String, default: "Soltero/a" },
    commandsUsed: { type: Number, default: 0 },
    registeredAt: { type: Date, default: Date.now },
    badges: { type: [String], default: [] }
});

module.exports = mongoose.models.profile || mongoose.model('profile', profileSchema);
