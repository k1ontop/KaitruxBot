const { EmbedBuilder, Collection } = require('discord.js');
const LogSettings = require('../../schemas/LogSettings.js');

module.exports = {
    name: 'guildBanAdd',
    async execute(client, member, reason = "Ninguna") {
        try {
            // Verifica que logSettings exista y está inicializado
            if (!client.logSettings) {
                client.logSettings = new Collection();
            }

            let settings = client.logSettings.get(member.guild.id);

            if (!settings || !settings['guildBanAdd']) {
                const dbSettings = await LogSettings.findOne({ guildId: member.guild.id });
                if (dbSettings) {
                    client.logSettings.set(member.guild.id, dbSettings.events);
                    settings = dbSettings.events;
                }
            }

            if (!settings || !settings['guildBanAdd']) {
                console.log(`No se encontró configuración para guildBanAdd en el servidor ${member.guild.id}`);
                return;
            }

            const channelLog = client.channels.cache.get(settings['guildBanAdd']);
            if (!channelLog) {
                console.error("El canal de logs no está definido.");
                return;
            }

            const guildBanAdd = new EmbedBuilder()
                .setColor('#0099ff')
                .setAuthor({
                    name: `${client.user.username} | Miembro Baneado`,
                    iconURL: client.user.displayAvatarURL({ size: 4096 }),
                })
                .setThumbnail("https://cdn.discordapp.com/emojis/1117871692803494023.webp?size=96&quality=lossless")
                .setDescription(
                    [
                        `**${member.user.username}** ha sido baneado`,
                        ``,
                        `**Nombre:** ${member.user.username}`,
                        `**ID:** ${member.user.id}`,
                    ].join("\n")
                )
                .setFooter({
                    text: `Razón: ${reason}`,
                    iconURL: member.user.displayAvatarURL({ dynamic: true, size: 4096 }),
                })
                .setTimestamp();

            await channelLog.send({ embeds: [guildBanAdd] });
        } catch (error) {
            console.error("Error manejando el evento de baneo de miembro:", error);
        }
    }
};
