// ./PrefixCommands/moderation/unmute.js
const { PermissionsBitField } = require("discord.js");

module.exports = {
  name: "unmute",
  description: "Quita el silencio a un usuario en el servidor.",
  botPerms: ["MuteMembers"],
  run: async (client, message, args) => {
    if (!message.member.permissions.has(PermissionsBitField.Flags.MuteMembers)) {
      return message.channel.send("No tienes permisos para usar este comando.");
    }

    const member = message.mentions.members.first();
    if (!member) {
      return message.channel.send("Debes mencionar a un usuario válido.");
    }

    await member.roles.remove("MUTE_ROLE_ID"); // Reemplaza MUTE_ROLE_ID con el ID del rol de mute
    message.channel.send(`${member.user.tag} ya no está silenciado.`);
  }
};
