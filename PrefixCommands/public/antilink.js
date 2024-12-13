const discord = require('discord.js');
const antilinkSchema = require(`${process.cwd()}/schemas/antilink.js`)

module.exports = {
  name: "antilink",
  description: "Configura el antilink para el servidor!",
  run: async (client, message, args) => {
    if (!args[0]) {
      return message.channel.send(
        `usa: !antilink <on|off>`
      );
    }
    if (args[0] === "On" || args[0] === "on") {
      const data = await antilinkSchema.findOne({
        GuildID: message.guild.id,
      });

      if (data) {
        await antilinkSchema.findOneAndRemove({
          GuildID: message.guild.id,
        });

        message.channel.send(`El antilink esta activo!`);

        let newData = new antilinkSchema({
          GuildID: message.guild.id,
        });
        newData.save();
      } else if (!data) {
        message.channel.send(`El antilink esta activo`);

        let newData = new antilinkSchema({
          GuildID: message.guild.id,
        });
        newData.save();
      }
    } else if (args[0] === "off" || args[0] === "Off") {
      const data2 = await antilinkSchema.findOne({
        GuildID: message.guild.id,
      });

      if (data2) {
        await antilinkSchema.findOneAndRemove({
          GuildID: message.guild.id,
        });

        return message.channel.send(`El antilink se ha apagado!`);
      } else if (!data2) {
        return message.channel.send(`Error!`);
      }
    }
  },
};