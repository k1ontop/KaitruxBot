const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const Club = require('../../schemas/club.js');

module.exports = {
    name: 'deleteclub',
    description: 'Elimina tu club',
    options: [
        {
            name: 'club',
            description: 'El nombre del club',
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ],
    run: async (client, interaction) => {
        const clubName = interaction.options.getString('club');
        const club = await Club.findOne({ name: clubName });

        if (!club) {
            return interaction.reply({ content: 'No se encontró el club.', ephemeral: true });
        }

        if (club.ownerId !== interaction.user.id) {
            return interaction.reply({ content: 'No eres el dueño del club.', ephemeral: true });
        }

        await Club.deleteOne({ name: clubName });

        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Club Eliminado')
            .setDescription(`Se ha eliminado el club "${clubName}" con éxito.`);

        interaction.reply({ embeds: [embed], ephemeral: true });
    }
};
