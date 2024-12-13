const mongoose = require('mongoose');

const uuserSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    isPremium: { type: Boolean, default: false }, // Nuevo campo
    premiumActivatedAt: { type: Date }, // Fecha de activación del premium, si es necesario
    // otros campos que tengas...
});

module.exports = mongoose.model('uuser', uuserSchema);
