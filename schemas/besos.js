const mongoose = require('mongoose');

const kissSchema = new mongoose.Schema({
    user1: String,
    user2: String,
    count: Number,
})

module.exports = mongoose.models.besos || mongoose.model('besos', kissSchema);
