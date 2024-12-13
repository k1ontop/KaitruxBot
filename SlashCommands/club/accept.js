const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const Club = require('../../schemas/club.js');
const Profile = require('../../schemas/profilexx.js');

module.exports = {
    name: 'clubaccept',
    description: 'Acepta una invitación a un club',
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

        const userProfile = await Profile.findOne({ userId: userId });
        if (!userProfile) {
            return interaction.reply({ content: 'No tienes un perfil creado. Usa el comando /profile primero.', ephemeral: true });
        }

        club.invites = club.invites.filter(inviteId => inviteId !== userId);
        club.members.push(userId);
        await club.save();

        userProfile.club = clubName;
        await userProfile.save();

        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Invitación Aceptada')
            .setDescription(`Te has unido al club "${clubName}".`);

        interaction.reply({ embeds: [embed], ephemeral: true });
    }
};
