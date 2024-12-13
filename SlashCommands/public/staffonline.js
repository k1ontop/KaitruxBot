const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const StaffRole = require('../../schemas/StaffRole.js');

module.exports = {
    name: "staffonlinelist",
    description: "Muestra la lista de miembros del staff y su tiempo online",
    run: async(client, interaction) => {
        try {
            const guildId = interaction.guild.id;
            const staffRole = await StaffRole.findOne({ guildId });

            if (!staffRole) {
                return interaction.reply('No se ha establecido ningún rol de staff.');
            }

            const role = interaction.guild.roles.cache.get(staffRole.roleId);
            const members = role.members.map(member => {
                const presence = member.presence ? member.presence.status : 'offline';
                const onlineTime = Math.floor(Math.random() * 10); // Aquí puedes integrar una lógica real para calcular el tiempo en línea
                return `${member.user.tag} (${presence}) (ha estado online ${onlineTime}h esta semana)`;
            });

            const embed = new EmbedBuilder()
                .setTitle('Lista de Staff Online')
                .setDescription(members.join('\n'))
                .setColor('#FF0000');

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply('Hubo un error al obtener la lista de staff online. Por favor, intenta de nuevo más tarde.');
        }
    }
};
