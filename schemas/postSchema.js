const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    guildId: String,
    channelId: String,
    resultChannelId: String,
    message: String,
    preguntas: [String],
    applicationId: String // ID único de la postulación
});

module.exports = mongoose.model('Post', PostSchema);
