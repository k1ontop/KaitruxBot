const mongoose = require('mongoose');

const hugSchema = new mongoose.Schema({
    user1: String,
    user2: String,
    count: Number,
})

module.exports = mongoose.models.abrazos || mongoose.model('abrazos', hugSchema);
