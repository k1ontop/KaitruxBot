const { EmbedBuilder, ApplicationCommandOptionType, PermissionsBitField } = require('discord.js');
const DisabledCommand = require(`${process.cwd()}/schemas/disableCommands.js`);

module.exports = {
    name: 'disablecommand',
    description: 'Deshabilita un comando en un canal o en todo el servidor.',
    options: [
        {
            name: 'comando',
            description: 'El nombre del comando a deshabilitar.',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: 'canal',
            description: 'El canal donde se deshabilitará el comando. (Opcional)',
            type: ApplicationCommandOptionType.Channel,
            required: false,

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

        // Verificar si el comando existe
        if (!client.commands.has(command)) {
            return interaction.reply({
                content: '❌ El comando especificado no existe.',
                ephemeral: true,
            });
        }

        // Guardar en la base de datos
        const filter = { guildId: guild.id, command };
        if (channel) filter.channelId = channel.id;

        const exists = await DisabledCommand.findOne(filter);
        if (exists) {
            return interaction.reply({
                content: '❌ Este comando ya está deshabilitado en el canal especificado o en el servidor.',
                ephemeral: true,
            });
        }

        await DisabledCommand.create(filter);

        const embed = new EmbedBuilder()
            .setTitle('Comando Deshabilitado')
            .setDescription(
                `El comando \`${command}\` ha sido deshabilitado ${
                    channel ? `en el canal ${channel}` : 'en todo el servidor'
                }.`
            )
            .setColor('Red');

        interaction.reply({ embeds: [embed] });
    },
};
