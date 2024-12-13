const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    guildId: { type: String, required: true },
    userId: { type: String, required: true },
    activities: [
        {
            name: { type: String, required: true },
            duration: { type: Number, default: 0 }
        }
    ]
});

module.exports = mongoose.model('Activity', activitySchema);
