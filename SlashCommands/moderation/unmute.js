const { ApplicationCommandOptionType, PermissionsBitField } = require("discord.js");

module.exports = {
    name: "unmute",
    description: "Desmutear a un usuario en el servidor.",
    options: [
        {
            name: 'usuario',
            description: 'El usuario a desmutear.',
            type: ApplicationCommandOptionType.User,
            required: true
        }
    ],
    run: async (client, interaction) => {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.MuteMembers)) {
            return interaction.reply({
                content: 'No tienes permisos para usar este comando.',
                ephemeral: true
            });
        }

        const member = interaction.options.getMember('usuario');
        if (!member) {
            return interaction.reply({
                content: 'Debes mencionar un usuario válido.',
                ephemeral: true
            });
        }

        const muteRole = interaction.guild.roles.cache.find(role => role.name === 'muteado');
        if (!muteRole) {
            return interaction.reply({
                content: 'El rol de muteado no existe en este servidor.',
                ephemeral: true
            });
        }

        if (member.roles.cache.has(muteRole.id)) {
            try {
                await member.roles.remove(muteRole.id);
                interaction.reply(`${member.user.tag} ha sido desmuteado.`);
            } catch (error) {
                console.error('Error al quitar el rol de muteado:', error);
                interaction.reply({
                    content: 'Ocurrió un error al intentar desmutear al usuario. Por favor, inténtalo más tarde.',
                    ephemeral: true
                });
            }
        } else {
            interaction.reply({
                content: 'El usuario no está actualmente muteado.',
                ephemeral: true
            });
        }
    }
};
