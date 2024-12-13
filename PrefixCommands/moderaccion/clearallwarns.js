// ./PrefixCommands/moderation/clearallwarns.js
const fs = require('fs');
const warnings = require('../../data/warnings.json');
const { PermissionsBitField } = require('discord.js');

module.exports = {
  name: 'clearall',
  description: 'Limpia todas las advertencias de un usuario.',
  botPerms: ["ManageMessages"],
  run: async (client, message, args) => {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
      return message.channel.send("No tienes permisos para usar este comando.");
    }

    const member = message.mentions.members.first();
    if (!member) {
      return message.channel.send("Debes mencionar a un usuario válido.");
    }

    if (!warnings[member.id] || warnings[member.id].length === 0) {
      return message.channel.send("Este usuario no tiene advertencias.");
    }

    delete warnings[member.id];
    fs.writeFileSync('./data/warnings.json', JSON.stringify(warnings, null, 2));
    message.channel.send(`Todas las advertencias de ${member.user.tag} han sido limpiadas.`);
  }
};
