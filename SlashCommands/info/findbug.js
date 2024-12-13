const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Cargar los códigos de error desde el archivo JSON
const errorCodesPath = path.resolve(__dirname, '../../data/errorCodes.json');
const errorCodes = JSON.parse(fs.readFileSync(errorCodesPath, 'utf-8'));

module.exports = {
    name: 'findbug',
    description: 'Busca la descripción de un error por su código.',
    options: [
        {
            name: 'codigo',
            description: 'El código de error que deseas buscar.',
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ],
    run: async (client, interaction) => {
        const errorCode = interaction.options.getString('codigo');
        const description = errorCodes[errorCode];

        if (!description) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle('❌ Error')
                        .setDescription(`No se encontró la descripción para el código de error #${errorCode}.`)
                        .setFooter({ text: 'Error código: #101' })
                        .setColor('#FF0000')
                ],
                ephemeral: true
            });
        }

        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`Información del Error #${errorCode}`)
                    .setDescription(description)
                    .setFooter({ text: 'Error código: #' + errorCode })
                    .setColor('#00FF00')
            ],
            ephemeral: true
        });
    }
};
