const { EmbedBuilder } = require('discord.js');
const Club = require('../../schemas/club.js');

module.exports = {
    name: 'clubinvites',
    description: 'Muestra tus invitaciones a clubes pendientes',
    options: [],
    run: async (client, interaction) => {
        const userId = interaction.user.id;
        const clubs = await Club.find({ invites: userId });

        if (clubs.length === 0) {
            return interaction.reply({ content: 'No tienes invitaciones a clubes pendientes.', ephemeral: true });
        }

        const clubNames = clubs.map(club => club.name).join('\n');

        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Invitaciones a Clubes')
            .setDescription(`Tienes invitaciones pendientes a los siguientes clubes:\n${clubNames}`);

        interaction.reply({ embeds: [embed], ephemeral: true });
    }
};
