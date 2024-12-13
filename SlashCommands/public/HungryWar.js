const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, AttachmentBuilder } = require('discord.js');
const HungryWar = require(`${process.cwd()}/schemas/HungryWar.js`); // Asegúrate de que la ruta es correcta

const attackMessages = [
    "${attacker.username} lanzó un Kamehameha a ${defender.username} desintegrándolo.",
    "${attacker.username} lanzó una bomba a ${defender.username} haciéndolo volar en pedazos.",
    "${attacker.username} invocó un tornado que arrasó con ${defender.username}.",
    "${attacker.username} usó un rayo láser y evaporó a ${defender.username}.",
    "${attacker.username} llamó a un dragón que devoró a ${defender.username}.",
    "${attacker.username} aplastó a ${defender.username} con un meteorito.",
    "${attacker.username} lanzó una ola de energía que hizo desaparecer a ${defender.username}.",
    "${attacker.username} disparó un cañón de plasma a ${defender.username} eliminándolo.",
    "${attacker.username} usó un hechizo de fuego y redujo a cenizas a ${defender.username}.",
    "${attacker.username} lanzó una lanza de hielo que atravesó a ${defender.username}.",
];

module.exports = {
    name: 'hungrywar',
    description: 'Inicia una Hungry War',
    options: [
        {
            name: 'maxplayers',
            type: 4, // INTEGER
            description: 'Número máximo de jugadores',
            required: true,
        },
    ],
    run: async (client, interaction) => {
        const maxPlayers = interaction.options.getInteger('maxplayers');
        const guildId = interaction.guild.id;
        const channelId = interaction.channel.id;
        const creatorId = interaction.user.id;

        try {
            // Crear un nuevo juego y guardar en la base de datos
            const hungryWar = new HungryWar({
                guildId,
                channelId,
                creatorId,
            });

            await hungryWar.save();

            const embed = new EmbedBuilder()
                .setTitle('¡Hungry War Iniciada!')
                .setDescription('Presiona el botón para unirte al juego. Presiona nuevamente para salir. El iniciador del comando puede forzar el inicio si no hay suficientes jugadores.')
                .setColor('#FF0000')
                .setFooter({ text: `Jugadores necesarios: ${maxPlayers}` });

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('join_hungrywar')
                        .setLabel('Unirse')
                        .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                        .setCustomId('force_start_hungrywar')
                        .setLabel('Forzar Inicio')
                        .setStyle(ButtonStyle.Danger)
                );

            await interaction.reply({ embeds: [embed], components: [row] });

            const filter = i => i.customId === 'join_hungrywar' || (i.customId === 'force_start_hungrywar' && i.user.id === creatorId);
            const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

            collector.on('collect', async i => {
                const game = await HungryWar.findOne({ guildId, channelId });
                if (!game) return;

                if (i.customId === 'join_hungrywar') {
                    const userId = i.user.id;
                    const playerIndex = game.participants.indexOf(userId);

                    if (playerIndex === -1) {
                        game.participants.push(userId);
                    } else {
                        game.participants.splice(playerIndex, 1);
                    }

                    await game.save();

                    await i.update({ embeds: [embed.setFooter({ text: `Jugadores: ${game.participants.length}/${maxPlayers}` })] });
                } else if (i.customId === 'force_start_hungrywar') {
                    if (!game.isStarted) {
                        game.isStarted = true;
                        await game.save();

                        await i.update({ content: '¡La Hungry War ha comenzado!', components: [] });

                        startHungryWar(client, interaction.channel, game.participants, guildId, channelId);
                    } else {
                        await i.update({ content: 'La Hungry War ya ha comenzado.', components: [] });
                    }
                }
            });

            collector.on('end', async collected => {
                const game = await HungryWar.findOne({ guildId, channelId });
                if (!game) return;

                if (!game.isStarted && game.participants.length >= maxPlayers) {
                    game.isStarted = true;
                    await game.save();

                    await interaction.followUp({ content: '¡La Hungry War ha comenzado automáticamente!', components: [] });

                    startHungryWar(client, interaction.channel, game.participants, guildId, channelId);
                } else if (!game.isStarted) {
                    await interaction.followUp({ content: 'No se alcanzó el número suficiente de jugadores. La Hungry War no comenzó.', components: [] });

                    // Resetear la configuración del juego
                    await HungryWar.deleteOne({ guildId, channelId });
                }
            });
        } catch (error) {
            console.error("Error al iniciar Hungry War:", error);
            await interaction.reply({ content: 'Hubo un error al iniciar Hungry War.', ephemeral: true });
        }
    },
};

const startHungryWar = async (client, channel, participants, guildId, channelId) => {
    while (participants.length > 1) {
        await new Promise(resolve => setTimeout(resolve, 8000));

        const attackerIndex = Math.floor(Math.random() * participants.length);
        const defenderIndex = (attackerIndex + 1) % participants.length;

        const attacker = client.users.cache.get(participants[attackerIndex]);
        const defender = client.users.cache.get(participants[defenderIndex]);

        if (!attacker || !defender) {
            console.error("Error: No se pudo encontrar el usuario");
            continue; // Salta esta iteración si no se encuentran los usuarios
        }

        // Selecciona un mensaje de ataque aleatorio
        const attackMessage = attackMessages[Math.floor(Math.random() * attackMessages.length)]
            .replace('${attacker.username}', attacker.username)
            .replace('${defender.username}', defender.username);

        const embed = new EmbedBuilder()
            .setTitle('¡Batalla!')
            .setDescription(attackMessage)
            .setColor('#FF0000');

        await channel.send({ embeds: [embed] });

        participants.splice(defenderIndex, 1);
    }

    const winner = client.users.cache.get(participants[0]);
    if (winner) {
        await channel.send({ content: `🎉 ¡Felicidades ${winner.username}! ¡Eres el ganador de la Hungry War! 🎉` });
    } else {
        await channel.send({ content: 'No se pudo determinar un ganador.' });
    }

    // Resetear la configuración del juego al terminar
    await HungryWar.deleteOne({ guildId, channelId });
};
