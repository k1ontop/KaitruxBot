const { ActivityType } = require("discord.js");

module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    console.log(`${client.user.username} Online`);

    client.user.setActivity({
      name: "customstatus",
      type: ActivityType.Custom,
      state: "Lo mejor del dia es cuando por fin puedo volver a prenderme gracias k1"
    });

  }
}