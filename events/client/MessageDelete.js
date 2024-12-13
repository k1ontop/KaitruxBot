const { EmbedBuilder } = require('discord.js');
const LogSettings = require('../../schemas/LogSettings.js');

module.exports = {
    name: 'messageDelete',
    async execute(message, client) {
        if (!message || !message.author || message.author.bot) return;

        try {
            // Obtener los ajustes de los logs para el servidor
            let settings = client.logSettings.get(message.guild.id);

            // Si no están los settings, cargarlos de la base de datos
            if (!settings || !settings['messageDelete']) {
                const dbSettings = await LogSettings.findOne({ guildId: message.guild.id });
                if (dbSettings) {
                    client.logSettings.set(message.guild.id, dbSettings.events);
                    settings = dbSettings.events;
                }
            }

            // Si no está habilitado el log para eliminación de mensajes, no hacer nada
            if (!settings || !settings['messageDelete']) return;

            // Obtener el canal de logs desde los ajustes
            const channelLog = client.channels.cache.get(settings['messageDelete']);
            if (!channelLog) {
                console.error("El canal de logs no está definido.");
                return;
            }

            // Crear el embed de log para el mensaje eliminado
            const messageDeleteEmbed = new EmbedBuilder()
                .setColor('#0099ff')
                .setAuthor({
                    name: `Mensaje Eliminado`,
                    iconURL: client.user.displayAvatarURL({ dynamic: true }),
                })
                .setThumbnail("https://cdn.discordapp.com/emojis/830790543659368448.webp?size=96&quality=lossless")
                .setDescription(
                    [
                        `### Contenido del Mensaje`,
                        `\`\`\`${message.content || 'Contenido no disponible'}\`\`\``
                    ].join("\n")
                )
                .addFields(
                    { name: `ID del Mensaje`, value: `${message.id}`, inline: false },
                    { name: `Autor`, value: `<@${message.author.id}>`, inline: false },
                    { name: `Datos del Autor`, value: `${message.author.username}**/**${message.author.id}`, inline: false },
                    { name: `Canal`, value: `<#${message.channel.id}>`, inline: false },
                    { name: `Fecha`, value: `<t:${parseInt(Date.now() / 1000)}:R>`, inline: true }
                );

            // Enviar el embed al canal de logs
            await channelLog.send({ embeds: [messageDeleteEmbed] });
        } catch (error) {
            console.error("Error manejando el evento de eliminación de mensaje:", error);
        }
    },
};
