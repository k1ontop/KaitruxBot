const mongoose = require('mongoose');

const gameTimeSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    username: { type: String, required: true },
    game: { type: String, required: true },
    totalTime: { type: Number, default: 0 }, // Tiempo total en milisegundos
    startTime: { type: Date, default: null }
});

const GameTime = mongoose.model('GameTime', gameTimeSchema);

module.exports = GameTime;
