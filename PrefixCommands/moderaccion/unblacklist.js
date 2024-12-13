const fs = require('fs');
const path = require('path');
const { EmbedBuilder } = require('discord.js');
const blacklistPath = path.join(__dirname, '../../data/blacklist.json');
let { blacklist } = require(blacklistPath);

module.exports = {
  name: 'unblacklist',
  description: 'Elimina un usuario de la blacklist',
  run: async (client, message, args) => {
    if (!message.member.permissions.has('ADMINISTRATOR')) {
      return message.reply('No tienes permisos para usar este comando.');
    }

    const user = message.mentions.users.first();
    if (!user) {
      return message.reply('Menciona a un usuario para eliminar de la blacklist.');
    }

    if (blacklist.includes(user.id)) {
      blacklist = blacklist.filter(id => id !== user.id);
      fs.writeFileSync(blacklistPath, JSON.stringify({ blacklist }, null, 2));

      const embed = new EmbedBuilder()
        .setTitle('Usuario eliminado de la blacklist')
        .setDescription(`${user.tag} ha sido eliminado de la blacklist.`)
        .setColor('#FF0000');
      message.channel.send({ embeds: [embed] });
    } else {
      message.reply('El usuario no está en la blacklist.');
    }
  }
};
