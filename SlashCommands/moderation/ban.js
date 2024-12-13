const { ApplicationCommandOptionType, PermissionsBitField, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const bans = require('../../data/bans.json');

module.exports = {
    name: 'ban',
    description: 'Ban a user.',
    options: [
        {
            name: 'user',
            description: 'The user to ban.',
            type: ApplicationCommandOptionType.User,
            required: true
        },
        {
            name: 'reason',
            description: 'Reason for the ban.',
            type: ApplicationCommandOptionType.String,
            required: false
        }
    ],
    run: async (client, interaction) => {
        const member = interaction.options.getMember('user');
        const reason = interaction.options.getString('reason') || 'No reason provided';

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            return interaction.reply({
                embeds: [new EmbedBuilder()
                    .setTitle('❌ Error')
                    .setDescription('You lack the necessary permissions to ban members.')
                    .setFooter({ text: 'Error code: #102' })
                    .setColor('#FF0000')
                ],
                ephemeral: true
            });
        }

        if (!member) {
            return interaction.reply({
                embeds: [new EmbedBuilder()
                    .setTitle('❌ Error')
                    .setDescription('Please mention a valid member to ban.')
                    .setFooter({ text: 'Error code: #101' })
                    .setColor('#FF0000')
                ],
                ephemeral: true
            });
        }

        if (!bans[member.id]) {
            bans[member.id] = [];
        }
        bans[member.id].push({
            reason,
            date: new Date().toISOString(),
            moderator: interaction.user.tag
        });

        fs.writeFileSync('./data/bans.json', JSON.stringify(bans, null, 2));
        await member.ban({ reason });

        interaction.reply({
            content: `${member.user.tag} has been banned. Reason: ${reason}`,
            ephemeral: false
        });
    }
};
