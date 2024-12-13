const mongoose = require('mongoose');

const forumSetupSchema = new mongoose.Schema({
    guildId: { type: String, required: true },
    categoryId: { type: String, required: true },
    mentionRoleId: { type: String, required: true },
    messageTemplate: { type: String, required: true }
});

module.exports = mongoose.model('ForumSetup', forumSetupSchema);
