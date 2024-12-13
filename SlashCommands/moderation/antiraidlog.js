const Antiraid = require(`${process.cwd()}/schemas/antiraid.js`);
const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'antiraidlogset',
    description: 'Configura un canal para los logs de un evento antiraid',
    options: [
        {
            name: 'channel',
            description: 'El canal donde se enviarán los logs',
            type: ApplicationCommandOptionType.Channel,
            required: true,
        },
        {
            name: 'event',
            description: 'El evento para configurar',
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
                { name: 'Channel Create', value: 'channelCreate' },
                { name: 'Channel Delete', value: 'channelDelete' },
                { name: 'Role Create', value: 'roleCreate' },
                { name: 'Role Delete', value: 'roleDelete' },
                { name: 'Role Update', value: 'roleUpdate' },
                { name: 'Guild Member Add', value: 'guildMemberAdd' },
            ],
        },
    ],
    run: async (interaction) => {
        const { guild, options } = interaction;
        const channel = options.getChannel('channel');
        const event = options.getString('event');

        if (!channel.isTextBased()) {
            return interaction.reply({
                content: 'Por favor selecciona un canal de texto válido.',
                ephemeral: true,
            });
        }

        try {
            await Antiraid.findOneAndUpdate(
                { guildId: guild.id },
                { $set: { [`events.${event}`]: channel.id } },
                { upsert: true }
            );

            const embed = new EmbedBuilder()
                .setColor('#00FF00')
                .setTitle('Antiraid Logs Configurados')
                .setDescription(
                    `Se configuró el canal de logs para **${event}** en <#${channel.id}>.`
                );

            return interaction.reply({ embeds: [embed], ephemeral: true });
        } catch (error) {
            console.error(error);
            return interaction.reply({
                content: 'Ocurrió un error al configurar el canal de logs.',
                ephemeral: true,
            });
        }
    },
};
