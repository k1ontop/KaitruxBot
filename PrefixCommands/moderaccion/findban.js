// ./PrefixCommands/moderation/findban.js
const bans = require('../../data/bans.json');
const { PermissionsBitField } = require('discord.js');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'findban',
  description: 'Encuentra los baneos de un usuario.',
  botPerms: ["BanMembers"],
  run: async (client, message, args) => {
    if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
      return message.channel.send("No tienes permisos para usar este comando.");
    }

    const userId = args[0];
    if (!userId) {
      return message.channel.send("Debes proporcionar una ID de usuario válida.");
    }

    const userBans = bans[userId];
    if (!userBans || userBans.length === 0) {
      return message.channel.send("Este usuario no tiene baneos registrados.");
    }

    const embed = new EmbedBuilder()
      .setTitle(`Baneos de ${userId}`)
      .setColor('#FF0000');

    userBans.forEach((ban, index) => {
      embed.addFields({ name: `Baneo ${index + 1}`, value: `**Razón:** ${ban.reason}\n**Fecha:** ${ban.date}\n**Moderador:** ${ban.moderator}` });
    });

    message.channel.send({ embeds: [embed] });
  }
};
