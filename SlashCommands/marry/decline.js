const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const Marriage = require('../../schemas/marry.js');

module.exports = {
    name: 'marrydecline',
    description: 'Rechaza una propuesta de matrimonio',
    options: [],
    run: async (client, interaction) => {
        const user2 = interaction.user;
        const user1Id = client.pendingMarriages.get(user2.id);

        if (!user1Id) {
            return interaction.reply({ content: 'No tienes ninguna propuesta de matrimonio pendiente.', ephemeral: true });
        }

        client.pendingMarriages.delete(user2.id);

        const embed = new EmbedBuilder()
            .setColor('#FF0000')
            .setTitle('Propuesta de Matrimonio Rechazada')
            .setDescription(`${user2} ha rechazado la propuesta de matrimonio de <@${user1Id}>.`);

        interaction.reply({ embeds: [embed] });
    }
};
