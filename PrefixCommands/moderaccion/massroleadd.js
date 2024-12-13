const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    PermissionsBitField,
} = require('discord.js');

module.exports = {
    name: 'massrole',
    description: 'Añade o elimina un rol a múltiples miembros usando prefijo.',
    /**
     * Ejecuta el comando.
     * @param {Object} client El cliente de Discord
     * @param {Object} message El mensaje recibido
     * @param {Array} args Argumentos del comando
     */
    run: async (client, message, args) => {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
            return message.reply('❌ No tienes permisos para gestionar roles.');
        }

        if (!message.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
            return message.reply('❌ No tengo permisos para gestionar roles.');
        }

        const action = args[0]?.toLowerCase(); // 'add' o 'delete'
        const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]);
        const requiredRole =
            message.mentions.roles.size > 1
                ? message.mentions.roles.last()
                : message.guild.roles.cache.get(args[2]);

        if (!['add', 'delete'].includes(action)) {
            return message.reply('❌ Especifica una acción válida: `add` o `delete`.');
        }

        if (!role) {
            return message.reply('❌ Menciona el rol que deseas asignar o eliminar.');
        }

        if (role.position >= message.guild.members.me.roles.highest.position) {
            return message.reply(
                '❌ No puedo gestionar este rol porque está por encima de mi rol más alto en la jerarquía.'
            );
        }

        // Filtrar miembros
        const members = await message.guild.members.fetch();
        let filteredMembers = members.filter((member) => !member.user.bot);

        if (requiredRole) {
            filteredMembers = filteredMembers.filter((member) =>
                member.roles.cache.has(requiredRole.id)
            );
        }

        const totalMembers = filteredMembers.size;
        if (totalMembers === 0) {
            return message.reply(
                '❌ No hay miembros a los que se pueda aplicar la acción con los filtros especificados.'
            );
        }

        const timePerMember = 0.5; // Tiempo estimado por miembro (en segundos)
        const estimatedTime = Math.ceil((totalMembers * timePerMember) / 60); // En minutos

        // Enviar mensaje inicial
        const embed = new EmbedBuilder()
            .setTitle('Asignando roles...')
            .setDescription(
                `**Acción:** ${action === 'add' ? 'Añadiendo' : 'Eliminando'} rol\n` +
                `**Rol:** ${role}\n` +
                `**Miembros revisados:** 0/${totalMembers}\n` +
                `**Tiempo estimado:** ${estimatedTime} minuto(s)`
            )
            .setColor('#f0f0f0');

        const actionRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('stop')
                .setLabel('Detener')
                .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
                .setCustomId('update')
                .setLabel('Actualizar')
                .setStyle(ButtonStyle.Secondary)
        );

        const messageSent = await message.reply({
            embeds: [embed],
            components: [actionRow],
        });

        let processed = 0;
        let updated = 0;
        let failed = 0;
        let omitted = 0;

        // Procesar miembros
        for (const member of filteredMembers.values()) {
            try {
                if (action === 'add') {
                    if (!member.roles.cache.has(role.id)) {
                        await member.roles.add(role);
                        updated++;
                    } else {
                        omitted++;
                    }
                } else if (action === 'delete') {
                    if (member.roles.cache.has(role.id)) {
                        await member.roles.remove(role);
                        updated++;
                    } else {
                        omitted++;
                    }
                }
            } catch (error) {
                failed++;
            }

            processed++;

            // Actualizar mensaje cada 10 miembros
            if (processed % 10 === 0 || processed === totalMembers) {
                const updatedEmbed = EmbedBuilder.from(embed)
                    .setDescription(
                        `**Acción:** ${action === 'add' ? 'Añadiendo' : 'Eliminando'} rol\n` +
                        `**Rol:** ${role}\n` +
                        `**Miembros revisados:** ${processed}/${totalMembers}\n` +
                        `**Tiempo estimado:** ${estimatedTime} minuto(s)`
                    );
                await messageSent.edit({ embeds: [updatedEmbed], components: [actionRow] });
            }
        }

        // Finalizar el proceso
        const finalEmbed = new EmbedBuilder()
            .setTitle('✅ Todos los miembros han sido revisados.')
            .setDescription(
                `**Revisados:** ${totalMembers}\n` +
                `**Actualizados:** ${updated}\n` +
                `**Fallidos:** ${failed}\n` +
                `**Omitidos:** ${omitted}\n` +
                `**Tiempo total:** ${Math.ceil((processed * timePerMember) / 60)} minuto(s)\n` +
                `**Rol:** ${role}`
            )
            .setColor('#f0f0f0');

        await messageSent.edit({ embeds: [finalEmbed], components: [] });
    },
};
