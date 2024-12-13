const Antiraid = require(`${process.cwd()}/schemas/antiraid.js`);
const handleNonWhitelistedMember = require(`${process.cwd()}/utils/handleNonWhitelistedMember.js`);
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'channelCreate',
    async execute(channel) {
        const guild = channel.guild;
        const antiraid = await Antiraid.findOne({ guildId: guild.id });

        if (!antiraid?.events?.channelCreate) return;

        const logChannel = guild.channels.cache.get(antiraid.events.channelCreate);
        if (!logChannel) return;

        const auditLogs = await guild.fetchAuditLogs({ limit: 1, type: 'CHANNEL_CREATE' });
        const entry = auditLogs.entries.first();

        if (entry) {
            await handleNonWhitelistedMember(guild, entry.executor.id, 'Canal creado sin permiso');
        }

        const embed = new EmbedBuilder()
            .setColor('#00FF00')
            .setTitle('🔧 Canal Creado')
            .addFields(
                { name: 'Nombre', value: channel.name, inline: true },
                { name: 'ID del Canal', value: channel.id, inline: true },
                { name: 'Creado por', value: entry?.executor.tag || 'Desconocido', inline: true },
                { name: 'Fecha', value: `<t:${Math.floor(Date.now() / 1000)}:F>`, inline: true }
            );

        await logChannel.send({ embeds: [embed] });
    },
};
