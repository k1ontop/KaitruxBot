const { EmbedBuilder } = require('discord.js');
const LogSettings = require('../../schemas/LogSettings.js');

module.exports = {
    name: 'guildMemberRemove',
    async execute(member, client) {
        try {
            let settings = client.logSettings.get(member.guild.id);

            if (!settings || !settings['guildMemberRemove']) {
                settings = await LogSettings.findOne({ guildId: member.guild.id });
                if (settings) {
                    client.logSettings.set(member.guild.id, settings.events);
                }
            }

            settings = client.logSettings.get(member.guild.id);
            if (!settings || !settings['guildMemberRemove']) return;

            const channelLog = client.channels.cache.get(settings['guildMemberRemove']);
            if (!channelLog) {
                console.error("El canal de logs no está definido.");
                return;
            }

            const guildMemberRemove = new EmbedBuilder()
                   .setColor('#0099ff')
                .setAuthor({
                    name: `${member.user.username} ha salido del servidor`,
                    iconURL: member.user.displayAvatarURL({ dynamic: true, size: 4096 }),
                })
                .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 4096 }))
                .setDescription([`**${member.user.username}** ha salido del servidor`].join("\n"))
                .addFields(
                    { name: `Nombre`, value: `${member.user.username}`, inline: true },
                    { name: `ID`, value: `${member.user.id}`, inline: true },
                    { name: `Cuándo`, value: `<t:${parseInt(Date.now() / 1000)}:R>`, inline: true }
                );

            await channelLog.send({ embeds: [guildMemberRemove] });
        } catch (error) {
            console.error("Error manejando el evento de salida de miembro:", error);
        }
    }
};
