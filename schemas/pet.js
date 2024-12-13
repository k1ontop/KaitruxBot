const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
    userId: { type: String, required: true }, // ID del usuario dueño de la mascota
    petName: { type: String, required: true }, // Nombre de la mascota
    petType: { type: String, required: true }, // Tipo de mascota
    createdAt: { type: Date, default: Date.now } // Fecha de creación
});

module.exports = mongoose.model('Pet', petSchema);
