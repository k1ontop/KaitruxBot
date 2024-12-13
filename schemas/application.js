const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    applicationId: { type: String, required: true, unique: true },
    guildId: { type: String, required: true },
    resultChannelId: { type: String, required: true },
    questions: { type: [String], required: true },
    userId: { type: String, required: true }  // <-- Define el campo userId como requerido
});

module.exports = mongoose.model('ApplicationConfig', applicationSchema);
