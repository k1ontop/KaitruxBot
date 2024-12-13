
const mongoose = require("mongoose");

const guildSchema = new mongoose.Schema({
    guildId: { type: String, required: true, unique: true },
    blacklist: { type: [String], default: [] },
    whitelist: { type: [String], default: [] },
});

module.exports = mongoose.model("Guild", guildSchema);
