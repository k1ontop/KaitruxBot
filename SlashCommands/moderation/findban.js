const { ApplicationCommandOptionType, PermissionsBitField, EmbedBuilder } = require('discord.js');
const bans = require('../../data/bans.json');

module.exports = {
    name: 'findban',
    description: 'Find a user\'s ban records.',
    options: [
        {
            name: 'userid',
            description: 'The ID of the user to search for bans.',
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ],
    run: async (client, interaction) => {
        const userId = interaction.options.getString('userid');

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            return interaction.reply({
                content: 'You do not have permissions to use this command.',
                ephemeral: true
            });
        }

        const userBans = bans[userId];
        if (!userBans || userBans.length === 0) {
            return interaction.reply({
                content: 'This user has no registered bans.',
                ephemeral: true
            });
        }

        const embed = new EmbedBuilder()
            .setTitle(`Bans for user ID: ${userId}`)
            .setColor('#FF0000');

        userBans.forEach((ban, index) => {
            embed.addFields({ name: `Ban ${index + 1}`, value: `**Reason:** ${ban.reason}\n**Date:** ${ban.date}\n**Moderator:** ${ban.moderator}` });
        });

        interaction.reply({ embeds: [embed], ephemeral: true });
    }
};
