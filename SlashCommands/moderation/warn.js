const fs = require('fs');
const warnings = require('../../data/warnings.json');
const { ApplicationCommandOptionType, PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'warn',
    description: 'Advierte a un usuario.',
    options: [
        {
            name: 'user',
            description: 'El usuario a advertir',
            type: ApplicationCommandOptionType.User,
            required: true
        },
        {
            name: 'reason',
            description: 'La razón de la advertencia',
            type: ApplicationCommandOptionType.String,
            required: false
        }
    ],
    run: async (client, interaction) => {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            return interaction.reply({
                content: "No tienes permisos para usar este comando.",
                ephemeral: true
            });
        }

        const member = interaction.options.getMember('user');
        if (!member) {
            return interaction.reply({
                content: "Debes mencionar a un usuario válido.",
                ephemeral: true
            });
        }

        const reason = interaction.options.getString('reason') || "Sin razón";
        if (!warnings[member.id]) {
            warnings[member.id] = [];
        }
        warnings[member.id].push({
            reason,
            date: new Date().toISOString(),
            moderator: interaction.user.tag
        });

        fs.writeFileSync('./data/warnings.json', JSON.stringify(warnings, null, 2));

        return interaction.reply({
            content: `${member.user.tag} ha sido advertido. Razón: ${reason}`,
            ephemeral: true
        });
    }
};
