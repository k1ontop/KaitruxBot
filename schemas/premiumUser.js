const mongoose = require('mongoose');

const premiumUserSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    activatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PremiumUser', premiumUserSchema);
