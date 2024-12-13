const Antiraid = require(`${process.cwd()}/schemas/antiraid.js`);
const Whitelist = require(`${process.cwd()}/schemas/whitelist.js`);

module.exports = {
    name: 'guildMemberAdd',
    async execute(member) {
        if (!member.user.bot) return;

        const guild = member.guild;

        const antiraid = await Antiraid.findOne({ guildId: guild.id });
        if (!antiraid?.active) return;

        const logChannel = guild.channels.cache.get(antiraid.logChannelId);

        try {
            const auditLogs = await guild.fetchAuditLogs({ limit: 1, type: 'BOT_ADD' });
            const entry = auditLogs.entries.first();
            const executor = entry?.executor;

            if (!executor) return;

            // Si el ejecutor es el dueño del servidor, no tomar acción
            if (executor.id === guild.ownerId) {
                if (logChannel) {
                    logChannel.send(`⚠️ **Bot añadido por el dueño:** ${member.user.tag} (${member.user.id}). No se tomaron acciones.`);
                }
                return;
            }

            // Verificar lista blanca
            const whitelistEntry = await Whitelist.findOne({ guildId: guild.id, userId: executor.id });
            if (whitelistEntry?.permissions.includes('addbot')) {
                if (logChannel) {
                    logChannel.send(`✅ **Bot añadido por usuario en lista blanca:** ${executor.tag} (${executor.id}). No se tomaron acciones.`);
                }
                return;
            }

            // Si no está en lista blanca, expulsar el bot
            if (logChannel) {
                logChannel.send(`⚠️ **Bot añadido sin permiso:** ${member.user.tag} (${member.user.id}) por ${executor.tag} (${executor.id}).`);
            }
            await member.kick('Antiraid: Bot añadido sin permiso').catch(console.error);
        } catch (error) {
            console.error('Error en guildMemberAdd:', error);
        }
    },
};
