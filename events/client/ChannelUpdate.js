const { EmbedBuilder } = require('discord.js');
const LogSettings = require('../../schemas/LogSettings.js');

module.exports = {
    name: 'channelUpdate',
    async execute(oldChannel, newChannel, client) {
        try {
            // Obtener configuración de logs
            let settings = client.logSettings.get(newChannel.guild.id);

            if (!settings || !settings['channelUpdate']) {
                settings = await LogSettings.findOne({ guildId: newChannel.guild.id });
                if (settings) {
                    client.logSettings.set(newChannel.guild.id, settings.events);
                }
            }

            settings = client.logSettings.get(newChannel.guild.id);
            if (!settings || !settings['channelUpdate']) return;

            const channelLog = client.channels.cache.get(settings['channelUpdate']);
            if (!channelLog) {
                console.error("El canal de logs no está definido.");
                return;
            }

            // Evitar mensajes duplicados (verificar último mensaje)
            const lastMessage = (await channelLog.messages.fetch({ limit: 1 })).first();
            if (
                lastMessage?.embeds[0]?.fields?.some(
                    (field) => field.name === 'De' && field.value === oldChannel.name
                )
            ) {
                return; // Ya se registró este cambio, evitar duplicados
            }

            // Crear embed de cambio de nombre
            const date = Date.now();
            const channelUpdateName = new EmbedBuilder()
                .setColor('#0099ff')
                .setAuthor({
                    name: `${client.user.username} | Actualización de Canal`,
                    iconURL: client.user.displayAvatarURL({ size: 4096 }),
                })
                .setThumbnail("https://cdn.discordapp.com/emojis/1138482145673871400.webp?size=96&quality=lossless")
                .setDescription(
                    [
                        `### Información del Canal:`,
                        `Nombre: **${newChannel.name}**`,
                        `Mención: <#${newChannel.id}>`,
                        `ID: **${newChannel.id}**`,
                    ].join("\n")
                )
                .addFields(
                    { name: `De`, value: `${oldChannel.name}`, inline: true },
                    { name: `A`, value: `${newChannel.name}`, inline: true },
                    { name: `Cuándo`, value: `<t:${parseInt(date / 1000)}:R>`, inline: true }
                );

            // Enviar embed solo si el nombre cambió
            if (oldChannel.name !== newChannel.name) {
                await channelLog.send({ embeds: [channelUpdateName] });
            }

            // Aquí puedes agregar más validaciones para otros cambios
            // Ejemplo: NSFW, Parent, Topic, etc.
        } catch (error) {
            console.error("Error manejando el evento de actualización de canal:", error);
        }
    },
};
