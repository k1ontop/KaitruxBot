const { EmbedBuilder } = require('discord.js');
const GameLogSettings = require(`${process.cwd()}/schemas/GameLogSettings.js`);

module.exports = {
    name: 'presenceUpdate',
    run: async (oldPresence, newPresence, client) => {
        try {
            // Obtener la configuración de logs del cliente
            let settings = client.logSettings.get(newPresence.guild.id);

            // Si la configuración de logs no está cargada, buscarla en la base de datos
            if (!settings || !settings.get('gameLog')) {
                settings = await GameLogSettings.findOne({ guildId: newPresence.guild.id });
                if (settings) {
                    client.logSettings.set(newPresence.guild.id, settings.events);
                }
            }

            // Obtener la configuración actualizada del cliente
            settings = client.logSettings.get(newPresence.guild.id);
            if (!settings || !settings.get('gameLog')) return;

            // Obtener el canal de logs configurado
            const channelLog = client.channels.cache.get(settings.get('gameLog'));
            if (!channelLog) {
                console.error("El canal de logs no está definido.");
                return;
            }

            // Registrar cuando un usuario comienza a jugar
            if (!oldPresence || !oldPresence.activities.some(a => a.type === 'PLAYING')) {
                newPresence.activities.forEach(async (activity) => {
                    if (activity.type === 'PLAYING') {
                        const embed = new EmbedBuilder()
                            .setColor('#0099ff')
                            .setAuthor({
                                name: `${newPresence.user.tag} comenzó a jugar`,
                                iconURL: newPresence.user.displayAvatarURL({ dynamic: true, size: 4096 }),
                            })
                            .setDescription([
                                `**Usuario:** <@${newPresence.user.id}>`,
                                `**ID:** ${newPresence.user.id}`,
                                `**Juego:** ${activity.name}`
                            ].join("\n"))
                            .setTimestamp();

                        await channelLog.send({ embeds: [embed] });
                    }
                });
            }

            // Registrar cuando un usuario deja de jugar
            if (oldPresence) {
                oldPresence.activities.forEach(async (activity) => {
                    if (activity.type === 'PLAYING' && !newPresence.activities.some(a => a.name === activity.name)) {
                        const embed = new EmbedBuilder()
                            .setColor('#0099ff')
                            .setAuthor({
                                name: `${newPresence.user.tag} dejó de jugar`,
                                iconURL: newPresence.user.displayAvatarURL({ dynamic: true, size: 4096 }),
                            })
                            .setDescription([
                                `**Usuario:** <@${newPresence.user.id}>`,
                                `**ID:** ${newPresence.user.id}`,
                                `**Juego:** ${activity.name}`
                            ].join("\n"))
                            .setTimestamp();

                        await channelLog.send({ embeds: [embed] });
                    }
                });
            }
        } catch (error) {
            console.error("Error manejando el evento de actualización de presencia:", error);
        }
    }
};
