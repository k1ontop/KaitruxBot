const mongoose = require('mongoose');

const guildPrefixSchema = new mongoose.Schema({
    guildId: {
        type: String,
        required: true,
        unique: true
    },
    prefix: {
        type: String,
        default: '!' // Prefijo predeterminado
    }
});

module.exports = mongoose.model('GuildPrefix', guildPrefixSchema);
