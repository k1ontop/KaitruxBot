const mongoose = require('mongoose');

const onlineNotificationSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    targetUserId: { type: String, required: true },
});

const OnlineNotification = mongoose.model('OnlineNotification', onlineNotificationSchema);

module.exports = OnlineNotification;
