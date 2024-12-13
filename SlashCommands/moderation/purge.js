const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'purge',
    description: 'Elimina hasta 100 mensajes a la vez',
    options: [
        {
            name: 'cantidad',
            description: 'Número de mensajes a eliminar',
            type: ApplicationCommandOptionType.Integer,
            required: true,
            min_value: 1,
            max_value: 100
        }
    ],
    run: async (client, interaction) => {
        const amount = interaction.options.getInteger('cantidad');

        if (!amount || amount < 1 || amount > 100) {
            return interaction.reply({ content: 'Por favor, proporciona un número válido entre 1 y 100.', ephemeral: true });
        }

        const messages = await interaction.channel.bulkDelete(amount, true);

        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Mensajes Eliminados')
            .setDescription(`Se han eliminado ${messages.size} mensajes.`)
            .setFooter({ text: 'Sistema de Purga' });

        interaction.reply({ embeds: [embed], ephemeral: true });
    }
};
