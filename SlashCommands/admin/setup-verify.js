const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: 'setup-verify',
    description: 'Configura el sistema de verificación.',
    options: [
        {
            name: 'canal',
            type: 7, // CHANNEL
            description: 'Canal donde se enviará el mensaje de verificación.',
            required: true,
        },
        {
            name: 'rol',
            type: 8, // ROLE
            description: 'Rol para los usuarios verificados (opcional).',
            required: true,
        },
        {
            name: 'tipo',
            type: 3, // STRING
            description: 'Tipo de verificación.',
            required: true,
            choices: [
                { name: 'Botón de color aleatorio', value: 'random_color' },
                { name: 'Orden de números mezclados', value: 'mixed_numbers' },
                { name: 'Escribir /verifyme', value: 'verifyme' },
            ],
        },
    ],
    run: async (client, interaction) => {
        const channel = interaction.options.getChannel('canal');
        const roleOption = interaction.options.getRole('rol');
        const verificationType = interaction.options.getString('tipo');
        let verifiedRole;

        if (roleOption) {
            verifiedRole = roleOption;
        } else {
            verifiedRole = await interaction.guild.roles.create({
                name: 'verificado',
                permissions: [],
                reason: 'Rol para usuarios verificados.',
            });
        }

        const embed = new EmbedBuilder()
            .setTitle('Sistema de Verificación')
            .setDescription(`El sistema de verificación está configurado como:\n**Tipo:** ${verificationType}`)
            .setColor('#00FF00');

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('start-verification').setLabel('Iniciar Verificación').setStyle(ButtonStyle.Primary)
        );

        await channel.send({ embeds: [embed], components: [row] });

        await interaction.reply({
            content: `✅ El sistema de verificación se ha configurado correctamente en ${channel}.`,
            ephemeral: true,
        });

        const filter = (i) => i.customId === 'start-verification';
        const collector = channel.createMessageComponentCollector({ filter, time: 60000 });

        collector.on('collect', async (i) => {
            if (verificationType === 'random_color') {
                const colors = [
                    { color: '🟥', style: ButtonStyle.Danger },
                    { color: '🟦', style: ButtonStyle.Primary },
                    { color: '🟩', style: ButtonStyle.Success },
                ];
                const randomColor = colors[Math.floor(Math.random() * colors.length)];
                
                const colorRow = new ActionRowBuilder().addComponents(
                    new ButtonBuilder().setCustomId('color-red').setLabel('🟥').setStyle(ButtonStyle.Danger),
                    new ButtonBuilder().setCustomId('color-blue').setLabel('🟦').setStyle(ButtonStyle.Primary),
                    new ButtonBuilder().setCustomId('color-green').setLabel('🟩').setStyle(ButtonStyle.Success)
                );

                await i.reply({
                    content: `¡Presiona el botón de color ${randomColor.color}!`,
                    components: [colorRow]
                });

                const colorFilter = (btn) => btn.user.id === i.user.id;
                const colorCollector = channel.createMessageComponentCollector({ filter: colorFilter, time: 15000 });

                colorCollector.on('collect', async (btn) => {
                    if (btn.customId === `color-${randomColor.color.slice(1).toLowerCase()}`) {
                        await btn.reply(`✅ Verificación completada con éxito.`);
                        // Añadir el rol verificado
                        const member = await interaction.guild.members.fetch(btn.user.id);
                        await member.roles.add(verifiedRole);
                    } else {
                        await btn.reply(`❌ Color incorrecto. Por favor, inténtalo de nuevo.`);
                    }
                });

                colorCollector.on('end', async (_, reason) => {
                    if (reason === 'time') {
                        await channel.send('⏰ El tiempo para la verificación ha terminado.');
                    }
                });
            } else if (verificationType === 'mixed_numbers') {
                const numbers = [1, 2, 3, 4, 5].sort(() => Math.random() - 0.5).join(' ');
                await i.reply(`Escribe los números en este orden: **${numbers}**`);
            } else if (verificationType === 'verifyme') {
                await i.reply('Escribe el comando `/verifyme` para completar la verificación.');
            }
        });

        collector.on('end', async (_, reason) => {
            if (reason === 'time') {
                await channel.send('⏰ El tiempo para la verificación ha terminado.');
            }
        });
    },
};
