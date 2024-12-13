const { EmbedBuilder, PermissionsBitField, ApplicationCommandOptionType } = require('discord.js');
const DisabledCommand = require(`${process.cwd()}/schemas/disableCommands.js`);

module.exports = {
    name: 'enablecommand',
    description: 'Habilita un comando deshabilitado en un canal o en todo el servidor.',
    options: [
        {
            name: 'comando',
            description: 'El nombre del comando a habilitar.',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: 'canal',
            description: 'El canal donde se habilitará el comando. (Opcional)',
            type: ApplicationCommandOptionType.Channel,
        },
    ],
    run: async (client, interaction) => {
        const { guild, options, member } = interaction;

        // Verificar permisos
        if (!member.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
            return interaction.reply({
                content: '❌ No tienes permisos para usar este comando.',
                ephemeral: true,
            });
        }

        const command = options.getString('comando').toLowerCase();
        const channel = options.getChannel('canal');

        // Verificar si el comando está deshabilitado
        const filter = { guildId: guild.id, command };
        if (channel) filter.channelId = channel.id;

        const disabledCommand = await DisabledCommand.findOne(filter);
        if (!disabledCommand) {
            return interaction.reply({
                content: `❌ El comando \`${command}\` no estaba deshabilitado en ${channel ? `el canal ${channel}` : 'el servidor'}.`,
                ephemeral: true,
            });
        }

        // Eliminar de la base de datos
        await DisabledCommand.deleteOne(filter);

        const embed = new EmbedBuilder()
            .setTitle('Comando Habilitado')
            .setDescription(
                `El comando \`${command}\` ha sido habilitado ${
                    channel ? `en el canal ${channel}` : 'en todo el servidor'
                }.`
            )
            .setColor('Green');

        interaction.reply({ embeds: [embed] });
    },
};
