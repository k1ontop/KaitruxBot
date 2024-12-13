// ./PrefixCommands/moderation/warn.js
const fs = require('fs');
const warnings = require('../../data/warnings.json');
const { PermissionsBitField } = require('discord.js');

module.exports = {
  name: 'warn',
  description: 'Advierte a un usuario.',
  botPerms: ["ManageMessages"],
  run: async (client, message, args) => {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
      return message.channel.send("No tienes permisos para usar este comando.");
    }

    const member = message.mentions.members.first();
    if (!member) {
      return message.channel.send("Debes mencionar a un usuario válido.");
    }

    const reason = args.slice(1).join(" ") || "Sin razón";
    if (!warnings[member.id]) {
      warnings[member.id] = [];
    }
    warnings[member.id].push({
      reason,
      date: new Date().toISOString(),
      moderator: message.author.tag
    });

    fs.writeFileSync('./data/warnings.json', JSON.stringify(warnings, null, 2));
    message.channel.send(`${member.user.tag} ha sido advertido. Razón: ${reason}`);
  }
};
