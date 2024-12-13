const { ApplicationCommandOptionType } = require('discord.js');
const LogSettings = require(`${process.cwd()}/schemas/LogSettings.js`);

module.exports = {
    name: 'setlogs',
    description: 'Define el canal de logs y los eventos a registrar',
    options: [
        {
            name: 'canal',
            description: 'El canal donde se enviarán los logs',
            type: ApplicationCommandOptionType.Channel,
            required: true
        },
        {
            name: 'evento',
            description: 'El evento a registrar',
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
                { name: 'ChannelCreate', value: 'channelCreate' },
                { name: 'ChannelUpdate', value: 'channelUpdate' },
                { name: 'GuildBanAdd', value: 'guildBanAdd' },
                { name: 'GuildMemberAdd', value: 'guildMemberAdd' },
                { name: 'GuildMemberRemove', value: 'guildMemberRemove' },
                { name: 'MessageDelete', value: 'messageDelete' },
                { name: 'PresenceUpdate', value: 'presenceUpdate' },
                { name: 'Todos', value: 'all' }
            ]
        }
    ],
    run: async (client, interaction) => {
        const channel = interaction.options.getChannel('canal');
        const event = interaction.options.getString('evento');

        // Obtener la configuración existente para el servidor
        let settings = await LogSettings.findOne({ guildId: interaction.guild.id });

        // Crear una nueva configuración si no existe
        if (!settings) {
            settings = new LogSettings({
                guildId: interaction.guild.id,
                events: {},
            });
        }

        // Actualizar el canal del evento específico
        if (event === 'all') {
            settings.events = {
                channelCreate: channel.id,
                channelUpdate: channel.id,
                guildBanAdd: channel.id,
                guildMemberAdd: channel.id,
                guildMemberRemove: channel.id,
                messageDelete: channel.id,
                presenceUpdate: channel.id
            };
        } else {
            settings.events[event] = channel.id;
        }

        // Guardar los cambios en la base de datos
        await settings.save();

        if (!client.logSettings) {
            client.logSettings = new Map();
        }

        client.logSettings.set(interaction.guild.id, settings.events);

        await interaction.reply({ content: `El canal de logs ha sido definido a ${channel} y el evento a registrar es ${event}.`, ephemeral: true });
    }
};
