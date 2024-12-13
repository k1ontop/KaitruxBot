const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const Club = require('../../schemas/club.js');

module.exports = {
    name: 'kickclub',
    description: 'Expulsa a un usuario de tu club',
    options: [
        {
            name: 'club',
            description: 'El nombre del club',
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: 'user',
            description: 'El usuario a expulsar',
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

        if (!club.members.includes(user.id)) {
            return interaction.reply({ content: 'El usuario no es miembro del club.', ephemeral: true });
        }

        club.members = club.members.filter(memberId => memberId !== user.id);
        await club.save();

        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Usuario Expulsado')
            .setDescription(`Se ha expulsado a ${user} del club "${clubName}".`);

        interaction.reply({ embeds: [embed], ephemeral: true });
    }
};
