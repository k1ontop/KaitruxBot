const fs = require('fs');
const path = require('path');
const { EmbedBuilder } = require('discord.js');
const blacklistPath = path.join(__dirname, '../../data/blacklist.json');
let { blacklist } = require(blacklistPath);

module.exports = {
  name: 'blacklist',
  description: 'Añade un usuario a la blacklist',
  run: async (client, message, args) => {
    if (!message.member.permissions.has('ADMINISTRATOR')) {
     return message.channel.send({embeds: [new EmbedBuilder()
       .setTitle('❌ Error')
       .setDescription('No puedes agregar a la lista negra a nadie porque te falta el permiso "Administrador"')
       .setFooter({text: 'Error codigo: #102'})
       .setColor('#FF0000')
   ]});
    }

    const user = message.mentions.users.first();
    if (!user) {
         return message.channel.send({embeds: [new EmbedBuilder()
         .setTitle('❌ Error')
         .setDescription('No me puedes agregar en la lista negra..')
         .setFooter({text: 'Error codigo: #100'})
         .setColor('#FF0000')
     ]});
    }

    if (!blacklist.includes(user.id)) {
      blacklist.push(user.id);
      fs.writeFileSync(blacklistPath, JSON.stringify({ blacklist }, null, 2));

      const embed = new EmbedBuilder()
        .setTitle('Usuario añadido a la blacklist')
        .setDescription(`${user.tag} ha sido añadido a la blacklist.`)
        .setColor('FF0000');
      message.channel.send({ embeds: [embed] });
    } else {
      message.reply('El usuario ya está en la blacklist.');
    }
  }
};
