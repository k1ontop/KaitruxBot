const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    PermissionsBitField,
} = require('discord.js');

module.exports = {
    name: 'massrole',
    description: 'Añade o elimina un rol a múltiples miembros.',
    options: [
        {
            name: 'action',
            description: 'Elige entre añadir o eliminar roles',
            type: 3, // STRING
            required: true,
            choices: [
                { name: 'add', value: 'add' },
                { name: 'delete', value: 'delete' },
            ],
        },
        {
            name: 'role',
            description: 'El rol que quieres añadir o eliminar',
            type: 8, // ROLE
            required: true,
        },
        {
            name: 'required-role',
            description: 'Solo afecta a los miembros que tienen este rol',
            type: 8, // ROLE
            required: false,
        },
    ],

    run: async (client, interaction) => {
        const action = interaction.options.getString('action');
        const role = interaction.options.getRole('role');
        const requiredRole = interaction.options.getRole('required-role');
        const guild = interaction.guild;

        // Verificar permisos
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
            return interaction.reply({
                content: 'No tienes permisos para gestionar roles.',
                ephemeral: true,
            });
        }

        if (!guild.members.me.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
            return interaction.reply({
                content: 'No tengo permisos para gestionar roles.',
                ephemeral: true,
            });
        }

        // Verificar jerarquía de roles
        if (role.position >= guild.members.me.roles.highest.position) {
            return interaction.reply({
                content: 'No puedo gestionar este rol porque está por encima de mi rol más alto en la jerarquía.',
                ephemeral: true,
            });
        }

        await interaction.deferReply();

        const members = await guild.members.fetch();
        let filteredMembers = members.filter((member) => !member.user.bot);

        // Filtrar miembros si hay un rol requerido
        if (requiredRole) {
            filteredMembers = filteredMembers.filter((member) =>
                member.roles.cache.has(requiredRole.id)
            );
        }

        const totalMembers = filteredMembers.size;
        const timePerMember = 0.5; // Tiempo estimado por miembro (en segundos)
        const estimatedTime = Math.ceil((totalMembers * timePerMember) / 60); // En minutos

        const embed = new EmbedBuilder()
            .setTitle('Asignando roles...')
            .setDescription(
                `**Acción:** ${action === 'add' ? 'Añadiendo' : 'Eliminando'} rol\n` +
                `**Rol:** ${role}\n` +
                `**Miembros revisados:** 0/${totalMembers}\n` +
                `**Tiempo estimado:** ${estimatedTime} minuto(s)`
            )
            .setColor('BLUE');

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

        const message = await interaction.editReply({
            embeds: [embed],
            components: [actionRow],
        });

        let processed = 0;
        let updated = 0;
        let failed = 0;
        let omitted = 0;

        // Procesar los miembros
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

            // Actualizar el mensaje cada 10 miembros
            if (processed % 10 === 0 || processed === totalMembers) {
                const updatedEmbed = EmbedBuilder.from(embed)
                    .setDescription(
                        `**Acción:** ${action === 'add' ? 'Añadiendo' : 'Eliminando'} rol\n` +
                        `**Rol:** ${role}\n` +
                        `**Miembros revisados:** ${processed}/${totalMembers}\n` +
                        `**Tiempo estimado:** ${estimatedTime} minuto(s)`
                    );
                await message.edit({ embeds: [updatedEmbed], components: [actionRow] });
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
                `**Tiempo de ejecución:** ${Math.ceil((processed * timePerMember) / 60)} minuto(s)\n` +
                `**Rol:** ${role}`
            )
            .setColor('GREEN');

        await message.edit({ embeds: [finalEmbed], components: [] });
    },
};
