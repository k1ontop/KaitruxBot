// ./PrefixCommands/moderation/mute.js
const { PermissionsBitField } = require("discord.js");

module.exports = {
  name: "mute",
  description: "Silencia a un usuario en el servidor.",
  botPerms: ["MuteMembers"],
  run: async (client, message, args) => {
    if (!message.member.permissions.has(PermissionsBitField.Flags.MuteMembers)) {
      return message.channel.send("No tienes permisos para usar este comando.");
    }

    const member = message.mentions.members.first();
    if (!member) {
      return message.channel.send("Debes mencionar a un usuario válido.");
    }

    let muteRole = message.guild.roles.cache.find(role => role.name === "muteado");
    
    // Crear el rol "muteado" si no existe
    if (!muteRole) {
      try {
        muteRole = await message.guild.roles.create({
          name: "muteado",
          color: "#000000",
          permissions: []
        });

        // Denegar permisos de enviar mensajes y hablar en todos los canales
        message.guild.channels.cache.forEach(async (channel) => {
          await channel.permissionOverwrites.edit(muteRole, {
            SendMessages: false,
            Speak: false,
            AddReactions: false
          });
        });

        message.channel.send("Rol `muteado` creado y permisos establecidos.");
      } catch (error) {
        console.error("Error al crear el rol `muteado`: ", error);
        return message.channel.send("Hubo un error al crear el rol `muteado`.");
      }
    }

    const reason = args.slice(1).join(" ") || "Sin razón";
    await member.roles.add(muteRole.id);
    message.channel.send(`${member.user.tag} ha sido silenciado. Razón: ${reason}`);
  }
};
