// models/Birthday.js
const mongoose = require('mongoose');

const birthdaySchema = new mongoose.Schema({
    userId: { type: String, required: true },
    guildId: { type: String, required: true },
    birthday: { type: String, required: true } // Formato: "DD-MM"
});

module.exports = mongoose.model('Birthday', birthdaySchema);
