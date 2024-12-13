const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const PremiumKey = require(`${process.cwd()}/schemas/keys.js`);
const { v4: uuidv4 } = require('uuid');
module.exports = {
    name: 'generatekey',
    description: 'Genera una clave premium',
    options: [
        {
            name: 'quantity',
            description: 'Cantidad de claves a generar',
            type: ApplicationCommandOptionType.Integer,
            required: true
        }
    ],
    run: async (client, interaction) => {
        const quantity = interaction.options.getInteger('quantity');
        const keys = [];

        for (let i = 0; i < quantity; i++) {
            const key = uuidv4();
            await PremiumKey.create({ key: key });
            keys.push(key);
        }

        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Claves Premium Generadas')
            .setDescription(`Se han generado ${quantity} claves premium:\n\n${keys.join('\n')}`)
            .setFooter({ text: 'Sistema Premium' });

        interaction.reply({ embeds: [embed], ephemeral: true });
    }
};
