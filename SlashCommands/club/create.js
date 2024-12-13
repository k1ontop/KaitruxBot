const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const Club = require('../../schemas/club.js');
const Profile = require('../../schemas/profilexx.js');

module.exports = {
    name: 'createclub',
    description: 'Crea un nuevo club',
    options: [
        {
            name: 'name',
            description: 'El nombre del club',
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ],
    run: async (client, interaction) => {
        const clubName = interaction.options.getString('name');
        const ownerId = interaction.user.id;

        const existingClub = await Club.findOne({ name: clubName });
        if (existingClub) {
            return interaction.reply({ content: 'Ya existe un club con ese nombre.', ephemeral: true });
        }

        const userProfile = await Profile.findOne({ userId: ownerId });
        if (!userProfile) {
            return interaction.reply({ content: 'No tienes un perfil creado. Usa el comando /profile primero.', ephemeral: true });
        }

        userProfile.club = clubName;
        await userProfile.save();

        await Club.create({ name: clubName, ownerId: ownerId, members: [ownerId] });

        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Club Creado')
            .setDescription(`Se ha creado el club "${clubName}" con éxito.`);

        interaction.reply({ embeds: [embed], ephemeral: true });
    }
};
