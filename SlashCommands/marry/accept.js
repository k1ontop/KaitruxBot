const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const Marriage = require('../../schemas/marry.js');

module.exports = {
    name: 'marryaccept',
    description: 'Acepta una propuesta de matrimonio',
    options: [],
    run: async (client, interaction) => {
        const user2 = interaction.user;
        const user1Id = client.pendingMarriages.get(user2.id);

        if (!user1Id) {
            return interaction.reply({ content: 'No tienes ninguna propuesta de matrimonio pendiente.', ephemeral: true });
        }

        await Marriage.create({ userId1: user1Id, userId2: user2.id });

        client.pendingMarriages.delete(user2.id);

        const embed = new EmbedBuilder()
            .setColor('#00FF00')
            .setTitle('¡Matrimonio Aceptado!')
            .setDescription(`${user2} ha aceptado la propuesta de matrimonio de <@${user1Id}>.`);

        interaction.reply({ embeds: [embed] });
    }
};
