const { ApplicationCommandOptionType, PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'mute',
    description: 'Mutear a un usuario en el servidor.',
    options: [
        {
            name: 'usuario',
            description: 'El usuario a mutear.',
            type: ApplicationCommandOptionType.User,
            required: true
        },
        {
            name: 'razón',
            description: 'Razón para el muteo.',
            type: ApplicationCommandOptionType.String,
            required: false
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
        const reason = interaction.options.getString('razón') || 'No se proporcionó una razón';

        if (!member) {
            return interaction.reply({
                content: 'Debes mencionar a un usuario válido.',
                ephemeral: true
            });
        }

        const botMember = interaction.guild.members.cache.get(client.user.id);

        if (member.roles.highest.position >= botMember.roles.highest.position) {
            return interaction.reply({
                content: 'No puedo mutear a este usuario porque su rol es más alto o igual que el mío.',
                ephemeral: true
            });
        }

        let muteRole = interaction.guild.roles.cache.find(role => role.name === 'muteado');
        
        if (!muteRole) {
            try {
                muteRole = await interaction.guild.roles.create({
                    name: 'muteado',
                    color: '#000000',
                    permissions: []
                });

                await Promise.all(interaction.guild.channels.cache.map(channel => 
                    channel.permissionOverwrites.edit(muteRole, {
                        SendMessages: false,
                        Speak: false,
                        AddReactions: false
                    })
                ));
            } catch (error) {
                console.error('Error creando el rol de muteo: ', error);
                return interaction.reply({
                    content: 'Hubo un error al crear el rol de muteo.',
                    ephemeral: true
                });
            }
        }

        await member.roles.add(muteRole.id);
        interaction.reply(`${member.user.tag} ha sido muteado. Razón: ${reason}`);
    }
};
