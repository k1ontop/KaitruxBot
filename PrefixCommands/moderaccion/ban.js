// ./PrefixCommands/moderation/ban.js
const fs = require('fs');
const bans = require('../../data/bans.json');
const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  name: 'ban',
  description: 'Banea a un usuario.',
  botPerms: ["BanMembers"],
  run: async (client, message, args) => {
    if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
       return message.channel.send({embeds: [new EmbedBuilder()
         .setTitle('❌ Error')
         .setDescription('Te faltan permisos querido amigo')
         .setFooter({text: 'Error codigo: #102'})
         .setColor('#FF0000')
     ]});
    }

    const member = message.mentions.members.first();
    if (!member) {
     return message.channel.send({embeds: [new EmbedBuilder()
       .setTitle('❌ Error')
       .setDescription('Banearme?? a mi?? MENCIONA A ALGUIEN MAS')
       .setFooter({text: 'Error codigo: #101'})
       .setColor('#FF0000')
   ]});    }

    const reason = args.slice(1).join(" ") || "Sin razón";
    if (!bans[member.id]) {
      bans[member.id] = [];
    }
    bans[member.id].push({
      reason,
      date: new Date().toISOString(),
      moderator: message.author.tag
    });

    fs.writeFileSync('./data/bans.json', JSON.stringify(bans, null, 2));
    await member.ban({ reason });
    message.channel.send(`${member.user.tag} ha sido baneado. Razón: ${reason}`);
  }
};
