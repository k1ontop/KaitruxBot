const Whitelist = require(`${process.cwd()}/schemas/whitelist.js`);
const { AuditLogEvent, PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'channelUpdate',
    async execute(oldChannel, newChannel) {
        try {
            const guildId = newChannel.guild.id;

            // Fetch audit logs
            const auditLogs = await newChannel.guild.fetchAuditLogs({ limit: 1, type: AuditLogEvent.ChannelUpdate });
            const entry = auditLogs.entries.first();
            if (!entry || !entry.executor) return; // Validar existencia de la entrada

            const user = entry.executor;
            const member = await newChannel.guild.members.fetch(user.id).catch(() => null);
            if (!member) return; // Si no se puede obtener al miembro, salir

            // Verificar permisos del bot
            const botMember = await newChannel.guild.members.fetch(newChannel.client.user.id);
            if (!botMember.permissions.has(PermissionsBitField.Flags.BanMembers)) {
                console.error('El bot no tiene permisos para banear miembros.');
                return;
            }

            // Consultar lista blanca
            const whitelist = await Whitelist.findOne({ guildId, userId: user.id });
            const hasPermission = whitelist && whitelist.permissions.includes('editarcanal');

            // Si el usuario no está en la lista blanca o no tiene permisos
            if (!hasPermission) {
                if (oldChannel.name) {
                    await newChannel.setName(oldChannel.name).catch((err) =>
                        console.error('Error al revertir el nombre del canal:', err)
                    );
                }

                if (member) {
                    await member.ban({ reason: 'Intento de editar canal sin permiso' }).catch((err) =>
                        console.error('Error al banear al miembro:', err)
                    );
                }
            }
        } catch (error) {
            console.error('Error en channelUpdate:', error);
        }
    },
};
