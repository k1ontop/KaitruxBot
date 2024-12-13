const fs = require('fs');
const path = require('path');
const { EmbedBuilder, ApplicationCommandOptionType, PermissionsBitField } = require('discord.js');
const blacklistPath = path.join(__dirname, '../../data/blacklist.json');
let { blacklist } = require(blacklistPath);

module.exports = {
    name: 'unblacklist',
    description: 'Remove a user from the blacklist.',
    options: [
        {
            name: 'user',
            description: 'The user to remove from the blacklist.',
            type: ApplicationCommandOptionType.User,
            required: true
        }
    ],
    run: async (client, interaction) => {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({
                content: 'You do not have the Administrator permission to use this command.',
                ephemeral: true
            });
        }

        const user = interaction.options.getUser('user');

        if (blacklist.includes(user.id)) {
            blacklist = blacklist.filter(id => id !== user.id);
            fs.writeFileSync(blacklistPath, JSON.stringify({ blacklist }, null, 2));

            const embed = new EmbedBuilder()
                .setTitle('User removed from the blacklist')
                .setDescription(`${user.tag} has been removed from the blacklist.`)
                .setColor('#FF0000');
            interaction.reply({ embeds: [embed] });
        } else {
            interaction.reply('The user is not on the blacklist.');
        }
    }
};
