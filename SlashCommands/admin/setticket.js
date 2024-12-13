const { ApplicationCommandOptionType, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ChannelType, PermissionFlagsBits, ButtonBuilder, ButtonStyle } = require('discord.js');
const StaffRole = require('../../schemas/StaffRole.js');
const activeTickets = new Map();

module.exports = {
    name: 'ticketset',
    description: 'Crea un nuevo ticket de soporte',
    options: [
        {
            name: 'canal',
            description: 'Selecciona el canal donde enviar el mensaje de ticket',
            type: ApplicationCommandOptionType.Channel,
            required: true,
            channelTypes: [ChannelType.GuildText]
        },
    ],
    run: async (client, interaction) => {
        const targetChannel = interaction.options.getChannel('canal');
        const guildId = interaction.guild.id;

        // Obtener el rol de Staff desde la base de datos
        const staffRoleData = await StaffRole.findOne({ guildId });
        if (!staffRoleData || !staffRoleData.roleId) {
            return interaction.reply({ content: 'No se ha configurado ningún rol de staff. Usa `/setstaffrole` para configurarlo.', ephemeral: true });
        }
        const staffRoleId = staffRoleData.roleId;

        // Obtener la categoría del canal
        const category = targetChannel.parent;
        if (!category || category.type !== ChannelType.GuildCategory) {
            return interaction.reply({ content: 'El canal seleccionado no pertenece a ninguna categoría válida.', ephemeral: true });
        }

        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Crea tu ticket')
            .setDescription('¿Necesitas asistencia sobre alguna duda o pregunta?\nAbre un ticket y los miembros del staff te ayudarán.\n\nTan solo tienes que desplegar el menú inferior y seleccionar la categoría que se corresponda con tu problema.')
            .addFields({ name: '\u200B', value: '⚠️ Hacer un uso inadecuado de este sistema puede tener sus consecuencias, recibimos cientos de tickets diariamente, así que por favor sea paciente.' });

        const row = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('ticket_category')
                    .setPlaceholder('Selecciona una categoría...')
                    .addOptions([
                        {
                            label: 'Dudas',
                            description: 'Tengo una duda',
                            value: 'dudas',
                            emoji: '❓',
                        },
                        {
                            label: 'Reportes',
                            description: 'Quiero reportar a un jugador',
                            value: 'reportes',
                            emoji: '🚫',
                        },
                        {
                            label: 'Tienda',
                            description: 'Tengo problemas con alguna compra',
                            value: 'tienda',
                            emoji: '🛒',
                        },
                        {
                            label: 'Soporte general',
                            description: 'Soporte en general',
                            value: 'soporte_general',
                            emoji: '🌍',
                        },
                        {
                            label: 'Apelaciones',
                            description: 'Mi sanción ha sido injusta, quiero apelar',
                            value: 'apelaciones',
                            emoji: '⚖️',
                        },
                    ])
            );

        await targetChannel.send({ embeds: [embed], components: [row] });

        await interaction.reply({ content: `El mensaje de creación de ticket ha sido enviado a ${targetChannel}`, ephemeral: true });

        const filter = i => i.customId === 'ticket_category';
        const collector = targetChannel.createMessageComponentCollector({ filter });

        collector.on('collect', async i => {
            if (activeTickets.has(i.user.id)) {
                const existingTicketChannelId = activeTickets.get(i.user.id);
                const existingTicketChannel = i.guild.channels.cache.get(existingTicketChannelId);

                if (existingTicketChannel) {
                    return i.reply({ content: `Ya tienes un ticket abierto en ${existingTicketChannel}. Por favor, cierra tu ticket actual antes de abrir uno nuevo.`, ephemeral: true });
                } else {
                    activeTickets.delete(i.user.id);
                }
            }

            const modal = new ModalBuilder()
                .setCustomId('ticket_modal')
                .setTitle('Añade información al ticket');

            const nickInput = new TextInputBuilder()
                .setCustomId('nickInput')
                .setLabel('¿CUÁL ES TU NICK?')
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            const problemInput = new TextInputBuilder()
                .setCustomId('problemInput')
                .setLabel('¿EN QUÉ NECESITAS AYUDA?')
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(true);

            const modalityInput = new TextInputBuilder()
                .setCustomId('modalityInput')
                .setLabel('¿EN QUÉ MODALIDAD/SERVICIO?')
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            const firstActionRow = new ActionRowBuilder().addComponents(nickInput);
            const secondActionRow = new ActionRowBuilder().addComponents(problemInput);
            const thirdActionRow = new ActionRowBuilder().addComponents(modalityInput);

            modal.addComponents(firstActionRow, secondActionRow, thirdActionRow);

            await i.showModal(modal);

            const submitted = await i.awaitModalSubmit({
                time: 300000,
                filter: (modalInteraction) => modalInteraction.customId === 'ticket_modal',
            }).catch(err => {
                console.error("Modal no fue enviado a tiempo:", err);
                return null;
            });

            if (!submitted) {
                return i.reply({ content: 'No enviaste el formulario a tiempo.', ephemeral: true });
            }

            const nick = submitted.fields.getTextInputValue('nickInput');
            const problem = submitted.fields.getTextInputValue('problemInput');
            const modality = submitted.fields.getTextInputValue('modalityInput');

            const ticketChannel = await i.guild.channels.create({
                name: `ticket-${i.user.username}`,
                type: ChannelType.GuildText,
                parent: category.id, // Usar automáticamente la categoría del canal
                permissionOverwrites: [
                    {
                        id: i.guild.id,
                        deny: [PermissionFlagsBits.ViewChannel],
                    },
                    {
                        id: i.user.id,
                        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
                    },
                    {
                        id: staffRoleId, // Rol de Staff
                        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
                    },
                ],
            });

            activeTickets.set(i.user.id, ticketChannel.id);

            const ticketEmbed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle(`Nuevo ticket de ${i.user.username}`)
                .setDescription('Por favor, verifica tu problema y un Staff vendrá a resolverlo.')
                .addFields(
                    { name: 'Nick', value: nick },
                    { name: 'Qué sucede?', value: problem },
                    { name: 'Modalidad/Servicio', value: modality }
                );

            const closeButton = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('close_ticket')
                        .setLabel('🔒 Cerrar ticket')
                        .setStyle(ButtonStyle.Danger)
                );

            await ticketChannel.send({ content: `<@&${staffRoleId}> | <@${i.user.id}>`, embeds: [ticketEmbed], components: [closeButton] });

            await submitted.reply({ content: `Tu ticket ha sido creado en ${ticketChannel}`, ephemeral: true });

            const closeFilter = i => i.customId === 'close_ticket';
            const closeCollector = ticketChannel.createMessageComponentCollector({ filter: closeFilter });

            closeCollector.on('collect', async i => {
                if (!i.member.roles.cache.has(staffRoleId)) {
                    return i.reply({ content: 'No tienes permiso para cerrar este ticket.', ephemeral: true });
                }

                await i.reply({ content: 'Este ticket será cerrado en 5 segundos.', ephemeral: true });

                activeTickets.delete(i.user.id);

                setTimeout(() => i.channel.delete(), 5000);
            });
        });
    },
};
