// schemas/antiraid.js
const mongoose = require('mongoose');

const antiraidSchema = new mongoose.Schema({
    guildId: { type: String, required: true },
    active: { type: Boolean, default: false },
    functions: [String], // Almacena las funciones activas: ["roleCreate", "roleDelete", "hierarchyChange"]
    logChannelId: { type: String, default: null },
});

module.exports = mongoose.model('Antiraid', antiraidSchema);
