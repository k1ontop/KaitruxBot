const { EmbedBuilder } = require('discord.js');
const LogSettings = require('../../schemas/LogSettings.js');

module.exports = {
    name: 'presenceUpdate',
    async execute(oldPresence, newPresence, client) {
        try {
            let settings = client.logSettings.get(newPresence.guild.id);

            if (!settings || !settings['presenceUpdate']) {
                settings = await LogSettings.findOne({ guildId: newPresence.guild.id });
                if (settings) {
                    client.logSettings.set(newPresence.guild.id, settings.events);
                }
            }

            settings = client.logSettings.get(newPresence.guild.id);
            if (!settings || !settings['presenceUpdate']) return;

            const channelLog = client.channels.cache.get(settings['presenceUpdate']);
            if (!channelLog) {
                console.error("El canal de logs no está definido.");
                return;
            }

            if (oldPresence && oldPresence.status !== newPresence.status) {
                let thumbnailURL;

                switch (newPresence.status) {
                    case 'dnd':
                        thumbnailURL = 'https://imgur.com/j7ZZ6L7.png';
                        break;
                    case 'idle':
                        thumbnailURL = 'https://imgur.com/L85t4sF.png';
                        break;
                    case 'online':
                        thumbnailURL = 'https://imgur.com/5Yx8VMk.png';
                        break;
                    default:
                        thumbnailURL = newPresence.user.displayAvatarURL({ dynamic: true, size: 4096 });
                        break;
                }

                const presenceUpdate = new EmbedBuilder()
                    .setColor(client.color || '#0099ff')
                    .setAuthor({
                        name: `${newPresence.user.tag} ha cambiado su estado`,
                        iconURL: newPresence.user.displayAvatarURL({ dynamic: true, size: 4096 }),
                    })
                    .setThumbnail(thumbnailURL)
                    .setDescription([
                        `**Usuario:** <@${newPresence.user.id}>`,
                        `**ID:** ${newPresence.user.id}`,
                        `**Estado Anterior:** ${oldPresence.status}`,
                        `**Nuevo Estado:** ${newPresence.status}`
                    ].join("\n"))
                    .setTimestamp();

                await channelLog.send({ embeds: [presenceUpdate] });
            }
        } catch (error) {
            console.error("Error manejando el evento de actualización de presencia:", error);
        }
    }
};
