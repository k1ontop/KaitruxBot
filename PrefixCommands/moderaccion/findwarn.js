// ./PrefixCommands/moderation/findwarn.js
const warnings = require('../../data/warnings.json');
const { PermissionsBitField } = require('discord.js');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'findwarn',
  description: 'Encuentra las advertencias de un usuario.',
  botPerms: ["ManageMessages"],
  run: async (client, message, args) => {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
      return message.channel.send("No tienes permisos para usar este comando.");
    }

    const member = message.mentions.members.first();
    if (!member) {
      return message.channel.send("Debes mencionar a un usuario válido.");
    }

    const userWarnings = warnings[member.id];
    if (!userWarnings || userWarnings.length === 0) {
      return message.channel.send("Este usuario no tiene advertencias.");
    }

    const embed = new EmbedBuilder()
      .setTitle(`Advertencias de ${member.user.tag}`)
      .setColor('#FF0000');

    userWarnings.forEach((warn, index) => {
      embed.addFields({ name: `Advertencia ${index + 1}`, value: `**Razón:** ${warn.reason}\n**Fecha:** ${warn.date}\n**Moderador:** ${warn.moderator}` });
    });

    message.channel.send({ embeds: [embed] });
  }
};
