const { EmbedBuilder } = require('discord.js');
const Economy = require('../../schemas/economy.js');

module.exports = {
    name: 'doublecoins',
    description: 'Duplica tus monedas o piérdelo todo en un minijuego de memoria.',
    options: [],
    run: async (client, interaction) => {
        const userEconomy = await Economy.findOne({ userId: interaction.user.id });
        if (!userEconomy || userEconomy.gold <= 0) {
            return interaction.reply({ content: '❌ No tienes monedas suficientes para jugar.', ephemeral: true });
        }

        // Palabras del juego
        const words = ['árbol', 'cajón', 'puerta', 'pared', 'mesa', 'luz', 'flor', 'ventana'];
        const selectedWords = words.sort(() => 0.5 - Math.random()).slice(0, 4); // Elegir 4 palabras
        const shuffledWords = [...selectedWords].sort(() => 0.5 - Math.random()); // Desordenar

        // Embed inicial con las palabras ordenadas
        const orderEmbed = new EmbedBuilder()
            .setTitle('Memoriza el orden')
            .setDescription(`Recuerda estas palabras en este orden:\n**${selectedWords.join(' → ')}**`)
            .setColor('Gold');

        const initialMessage = await interaction.reply({ embeds: [orderEmbed], fetchReply: true });

        // Eliminar mensaje inicial después de 4 segundos
        setTimeout(async () => {
            await initialMessage.delete();

            // Embed con palabras desordenadas
            const shuffleEmbed = new EmbedBuilder()
                .setTitle('Ordena las palabras')
                .setDescription('Escribe las palabras en el orden correcto, una por una.')
                .addFields({ name: 'Palabras:', value: shuffledWords.join(' → ') })
                .setColor('Gold');

            await interaction.followUp({ embeds: [shuffleEmbed] });

            // Crear colector para respuestas del usuario
            const filter = (msg) => msg.author.id === interaction.user.id;
            const collector = interaction.channel.createMessageCollector({ filter, time: 30000 });

            let userIndex = 0; // Índice actual de la palabra a evaluar
            collector.on('collect', async (msg) => {
                if (msg.content === selectedWords[userIndex]) {
                    userIndex++;
                    await msg.reply('✅ Correcto');

                    // Si el usuario acierta todas las palabras
                    if (userIndex === selectedWords.length) {
                        collector.stop('success');
                    }
                } else {
                    await msg.reply('❌ Incorrecto, perdiste.');
                    collector.stop('failure');
                }
            });

            collector.on('end', async (_, reason) => {
                if (reason === 'success') {
                    userEconomy.gold *= 2;
                    await userEconomy.save();
                    await interaction.followUp(`🎉 ¡Ganaste! Tus monedas se duplicaron. Ahora tienes **${userEconomy.gold} monedas**.`);
                } else if (reason === 'failure') {
                    userEconomy.gold = 0;
                    await userEconomy.save();
                    await interaction.followUp('❌ Perdiste todas tus monedas.');
                } else {
                    await interaction.followUp('⏰ Se acabó el tiempo. Perdiste.');
                }
            });
        }, 4000); // 4 segundos
    },
};
