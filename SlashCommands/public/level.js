const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const Level = require('../../schemas/level.js');

module.exports = {
    name: 'level',
    description: 'Muestra tu nivel y XP',
    options: [
        {
            name: 'user',
            description: 'Elige al usuario',
            type: ApplicationCommandOptionType.User,
            required: false
        }
    ],
    run: async (client, interaction) => {
        const user = interaction.options.getUser('user');
        const levelData = await Level.findOne({ guildId: interaction.guild.id, userId: user.id });

        if (!levelData) {
            return interaction.reply({ content: 'Este usuario no tiene ningún nivel registrado.', ephemeral: true });
        }

        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle(`Nivel y XP de ${user.tag}`)
            .setDescription(`Nivel: ${levelData.level}\nXP: ${levelData.xp}`)
            .setFooter({ text: 'Sistema de Niveles' });

        interaction.reply({ embeds: [embed] });
    }
};

