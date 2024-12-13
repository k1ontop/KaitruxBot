// ./PrefixCommands/moderation/unban.js
const fs = require('fs');
const bans = require('../../data/bans.json');
const { PermissionsBitField } = require('discord.js');

module.exports = {
  name: 'unban',
  description: 'Desbanea a un usuario.',
  botPerms: ["BanMembers"],
  run: async (client, message, args) => {
    if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
      return message.channel.send("No tienes permisos para usar este comando.");
    }

    const userId = args[0];
    if (!userId) {
      return message.channel.send("Debes proporcionar una ID de usuario válida.");
    }

    const user = await client.users.fetch(userId);
    if (!user) {
      return message.channel.send("No se encontró ningún usuario con esa ID.");
    }

    if (!bans[userId] || bans[userId].length === 0) {
      return message.channel.send("Este usuario no tiene baneos registrados.");
    }

    await message.guild.members.unban(userId);
    message.channel.send(`${user.tag} ha sido desbaneado.`);
  }
};
