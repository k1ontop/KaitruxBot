const mongoose = require('mongoose');

const economySchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    gold: { type: Number, default: 0 }
});

module.exports = mongoose.models.Economy || mongoose.model('Economy', economySchema);
