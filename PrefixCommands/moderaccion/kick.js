// ./PrefixCommands/moderation/kick.js
const { PermissionsBitField } = require("discord.js");

module.exports = {
  name: "kick",
  description: "Expulsa a un usuario del servidor.",
  botPerms: ["KickMembers"],
  run: async (client, message, args) => {
    if (!message.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
      return message.channel.send({embeds: [new EmbedBuilder()
         .setTitle('❌ Error')
         .setDescription('No tienes suficientes')
         .setFooter({text: 'Error codigo: #101'})
         .setColor('#FF0000')
     ]});
    }

    const member = message.mentions.members.first();
    if (!member) {
      return message.channel.send("Debes mencionar a un usuario válido.");
    }

    if (!member.kickable) {
      return message.channel.send("No puedo expulsar a este usuario.");
    }

    const reason = args.slice(1).join(" ") || "Sin razón";
    await member.kick(reason);
    message.channel.send(`${member.user.tag} ha sido expulsado. Razón: ${reason}`);
  }
};
