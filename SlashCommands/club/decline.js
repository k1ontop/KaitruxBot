const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const Club = require('../../schemas/club.js');

module.exports = {
    name: 'clubdecline',
    description: 'Rechaza una invitación a un club',
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
        const userId = interaction.user.id;
        const club = await Club.findOne({ name: clubName });

        if (!club) {
            return interaction.reply({ content: 'No se encontró el club.', ephemeral: true });
        }

        if (!club.invites.includes(userId)) {
            return interaction.reply({ content: 'No tienes una invitación a este club.', ephemeral: true });
        }

        club.invites = club.invites.filter(inviteId => inviteId !== userId);
        await club.save();

        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Invitación Rechazada')
            .setDescription(`Has rechazado la invitación al club "${clubName}".`);

        interaction.reply({ embeds: [embed], ephemeral: true });
    }
};
