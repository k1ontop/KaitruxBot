const Whitelist = require(`${process.cwd()}/schemas/whitelist.js`);
const LogSettings = require(`${process.cwd()}/schemas/LogSettings.js`);
const { EmbedBuilder, AuditLogEvent } = require('discord.js');

module.exports = {
    name: 'channelDelete',
    async execute(channel) {
        const guildId = channel.guild.id;

        try {
            // Obtener registros de auditoría
            const auditLogs = await channel.guild.fetchAuditLogs({ limit: 1, type: AuditLogEvent.ChannelDelete });
            const entry = auditLogs.entries.first();
            const executor = entry?.executor;

            if (!executor) return;

            // Verificar si el ejecutor es el propietario del servidor
            if (executor.id === channel.guild.ownerId) {
                console.log(`El propietario del servidor ${executor.tag} eliminó el canal, no se realizará ninguna acción.`);
                return;
            }

            // Verificar si el usuario está en la lista blanca
            const whitelistEntry = await Whitelist.findOne({ guildId, userId: executor.id });
            if (whitelistEntry?.permissions.includes('deletechannel')) {
                console.log(`El usuario ${executor.tag} está en la lista blanca con permiso para eliminar canales.`);
                return;
            }

            // Restaurar canal eliminado
            const restoredChannel = await channel.guild.channels.create({
                name: channel.name,
                type: channel.type,
                topic: channel.topic || null,
                nsfw: channel.nsfw,
                parent: channel.parentId || null,
                permissionOverwrites: channel.permissionOverwrites.cache.map(overwrite => ({
                    id: overwrite.id,
                    allow: overwrite.allow.bitfield,
                    deny: overwrite.deny.bitfield,
                    type: overwrite.type,
                })),
                position: channel.position || 0,
            }).catch(err => console.error('Error al recrear el canal:', err));

            if (restoredChannel) {
                console.log(`Canal "${channel.name}" restaurado exitosamente.`);
            }

        } catch (error) {
            console.error('Se ha producido un error:', error);
        }
    }
};
