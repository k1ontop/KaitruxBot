const { EmbedBuilder } = require('discord.js');
const LogSettings = require('../../schemas/LogSettings.js');

module.exports = {
    name: 'guildMemberAdd',
    async execute(member, client) {
        try {
            let settings = client.logSettings.get(member.guild.id);

            if (!settings || !settings['guildMemberAdd']) {
                settings = await LogSettings.findOne({ guildId: member.guild.id });
                if (settings) {
                    client.logSettings.set(member.guild.id, settings.events);
                }
            }

            settings = client.logSettings.get(member.guild.id);
            if (!settings || !settings['guildMemberAdd']) return;

            const channelLog = client.channels.cache.get(settings['guildMemberAdd']);
            if (!channelLog) {
                console.error("El canal de logs no está definido.");
                return;
            }

            const guildMemberAdd = new EmbedBuilder()
         .setColor('#0099ff')
                .setAuthor({
                    name: `${member.user.username} ha ingresado al servidor`,
                    iconURL: member.user.displayAvatarURL({ dynamic: true, size: 4096 }),
                })
                .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 4096 }))
                .setDescription([`<@${member.user.id}> ha ingresado al servidor`].join("\n"))
                .addFields(
                    { name: `Nombre`, value: `${member.user.username}`, inline: true },
                    { name: `ID`, value: `${member.user.id}`, inline: true },
                    { name: `Cuando`, value: `<t:${parseInt(Date.now() / 1000)}:R>`, inline: true }
                );

            await channelLog.send({ embeds: [guildMemberAdd] });
        } catch (error) {
            console.error("Error manejando el evento de ingreso de miembro:", error);
        }
    }
};
