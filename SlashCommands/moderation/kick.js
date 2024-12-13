const { ApplicationCommandOptionType, PermissionsBitField, EmbedBuilder } = require("discord.js");

module.exports = {
    name: "kick",
    description: "Kick a user from the server.",
    options: [
        {
            name: 'user',
            description: 'The user to kick.',
            type: ApplicationCommandOptionType.User,
            required: true
        },
        {
            name: 'reason',
            description: 'Reason for the kick.',
            type: ApplicationCommandOptionType.String,
            required: false
        }
    ],
    run: async (client, interaction) => {
        const member = interaction.options.getMember('user');
        const reason = interaction.options.getString('reason') || "No reason provided";

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
            return interaction.reply({
                content: 'no tienes permisos para usar este comando...',
                ephemeral: true
            });
        }

        if (!member) {
            return interaction.reply({
                content: 'You must mention a valid user.',
                ephemeral: true
            });
        }

        if (!member.kickable) {
            return interaction.reply({
                content: 'I cannot kick this user.',
                ephemeral: true
            });
        }

        await member.kick(reason);
        interaction.reply({
            content: `${member.user.tag} has been kicked. Reason: ${reason}`
        });
    }
};
