const Antiraid = require(`${process.cwd()}/schemas/antiraid.js`);
const handleNonWhitelistedMember = require(`${process.cwd()}/utils/handleNonWhitelistedMember.js`);
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'channelDelete',
    async execute(channel) {
        const guild = channel.guild;
        const antiraid = await Antiraid.findOne({ guildId: guild.id });

        if (!antiraid?.events?.channelDelete) return;

        const logChannel = guild.channels.cache.get(antiraid.events.channelDelete);
        if (!logChannel) return;

        const auditLogs = await guild.fetchAuditLogs({ limit: 1, type: 'CHANNEL_DELETE' });
        const entry = auditLogs.entries.first();

        if (entry) {
            await handleNonWhitelistedMember(guild, entry.executor.id, 'Canal eliminado sin permiso');
        }

        const embed = new EmbedBuilder()
            .setColor('#FF0000')
            .setTitle('❌ Canal Eliminado')
            .addFields(
                { name: 'Nombre', value: channel.name, inline: true },
                { name: 'ID del Canal', value: channel.id, inline: true },
                { name: 'Eliminado por', value: entry?.executor.tag || 'Desconocido', inline: true },
                { name: 'Fecha', value: `<t:${Math.floor(Date.now() / 1000)}:F>`, inline: true }
            );

        await logChannel.send({ embeds: [embed] });
    },
};
