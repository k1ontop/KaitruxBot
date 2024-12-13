const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Cargar los códigos de error desde el archivo JSON
const errorCodesPath = path.resolve(__dirname, '../../data/errorCodes.json');
const errorCodes = JSON.parse(fs.readFileSync(errorCodesPath, 'utf-8'));

module.exports = {
  name: 'findbug',
  description: 'Busca la descripción de un error por su código.',
  usage: 'findbug <código de error>',
  run: async (client, message, args) => {
    const errorCode = args[0];

    if (!errorCode) {
      return message.channel.send({
        embeds: [new EmbedBuilder()
          .setTitle('❌ Error')
          .setDescription('Por favor proporciona un código de error.')
          .setFooter({ text: 'Error código: #100' })
          .setColor('#FF0000')
        ]
      });
    }

    const description = errorCodes[errorCode];

    if (!description) {
      return message.channel.send({
        embeds: [new EmbedBuilder()
          .setTitle('❌ Error')
          .setDescription(`No se encontró la descripción para el código de error #${errorCode}.`)
          .setFooter({ text: 'Error código: #101' })
          .setColor('#FF0000')
        ]
      });
    }

    return message.channel.send({
      embeds: [new EmbedBuilder()
        .setTitle(`🔍 Información del Error #${errorCode}`)
        .setDescription(description)
        .setFooter({ text: 'Error código: #' + errorCode })
        .setColor('#00FF00')
      ]
    });
  }
};
