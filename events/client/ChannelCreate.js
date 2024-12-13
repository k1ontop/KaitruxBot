const Whitelist = require(`${process.cwd()}/schemas/whitelist.js`);
const LogSettings = require(`${process.cwd()}/schemas/LogSettings.js`);
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'channelCreate',
    async execute(channel) {
        const guildId = channel.guild.id;

        try {

            const executor = entry?.executor;

            // Preparar embed para el log
            const logSettings = await LogSettings.findOne({ guildId });
            const logChannelId = logSettings?.events?.channelCreate;
            const logChannel = channel.guild.channels.cache.get(logChannelId);

            if (!logChannel) {
                console.warn('El canal de logs no está configurado.');
                return;
            }

            const embed = new EmbedBuilder()
                .setColor('#00FF00')
                .setTitle('Canal Creado')
                .setDescription(`Un canal fue creado por **${executor.tag}**`)
                .addFields(
                    { name: 'Nombre del Canal', value: `${channel.name}`, inline: true },
                    { name: 'ID del Canal', value: `${channel.id}`, inline: true },
                    { name: 'Categoría', value: `${channel.parent?.name || 'Ninguna'}`, inline: true },
                    { name: 'NSFW', value: `${channel.nsfw ? 'Sí' : 'No'}`, inline: true },
                    { name: 'Fecha', value: `<t:${Math.floor(channel.createdTimestamp / 1000)}:R>`, inline: true }
                )
                .setTimestamp();

            await logChannel.send({ embeds: [embed] });
        } catch (error) {
            console.error('Error en channelCreate:', error);
        }
    },
};
