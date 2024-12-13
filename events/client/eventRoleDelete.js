const Antiraid = require(`${process.cwd()}/schemas/antiraid.js`);
const Whitelist = require(`${process.cwd()}/schemas/whitelist.js`);
const { AuditLogEvent } = require('discord.js');

module.exports = {
    name: 'roleDelete',
    async execute(role) {
        const guild = role.guild;
        const antiraid = await Antiraid.findOne({ guildId: guild.id });

        if (!antiraid?.active) return;

        const logChannel = guild.channels.cache.get(antiraid.logChannelId);
        const auditLogs = await guild.fetchAuditLogs({ limit: 1, type: AuditLogEvent.RoleDelete });
        const entry = auditLogs.entries.first();
        const executor = entry?.executor;

        if (executor && !(await Whitelist.findOne({ guildId: guild.id, userId: executor.id }))) {
            if (logChannel) {
                logChannel.send(`⚠️ **Rol eliminado:** ${role.name} por ${executor.tag}.`);
            }
        }
    },
};
