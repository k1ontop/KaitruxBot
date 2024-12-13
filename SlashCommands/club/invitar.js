const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const Club = require('../../schemas/club.js');
const Profile = require('../../schemas/profilexx.js');

module.exports = {
    name: 'inviteclub',
    description: 'Invita a un usuario a tu club',
    options: [
        {
            name: 'club',
            description: 'El nombre del club',
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: 'user',
            description: 'El usuario a invitar',
            type: ApplicationCommandOptionType.User,
            required: true
        }
    ],
    run: async (client, interaction) => {
        const clubName = interaction.options.getString('club');
        const user = interaction.options.getUser('user');
        const club = await Club.findOne({ name: clubName });

        if (!club) {
            return interaction.reply({ content: 'No se encontró el club.', ephemeral: true });
        }

        if (club.ownerId !== interaction.user.id) {
            return interaction.reply({ content: 'No eres el dueño del club.', ephemeral: true });
        }

        if (club.members.includes(user.id)) {
            return interaction.reply({ content: 'El usuario ya es miembro del club.', ephemeral: true });
        }

        const userProfile = await Profile.findOne({ userId: user.id });
        if (!userProfile) {
            return interaction.reply({ content: 'El usuario no tiene un perfil creado. El usuario debe usar el comando /profile primero.', ephemeral: true });
        }

        club.invites.push(user.id);
        await club.save();

        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Usuario Invitado')
            .setDescription(`Se ha invitado a ${user} al club "${clubName}".`);

        interaction.reply({ embeds: [embed], ephemeral: true });
    }
};
