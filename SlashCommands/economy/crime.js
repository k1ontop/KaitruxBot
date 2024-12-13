const Economy = require('../../schemas/economy.js');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'crime',
    description: 'Intenta cometer un crimen para ganar oro (riesgo incluido).',
    options: [],
    run: async (client, interaction) => {
        const outcomes = [
            { success: true, amount: 150, message: 'Asaltaste un convoy mercante y obtuviste **150 de oro**.' },
            { success: true, amount: 250, message: 'Robaste un artefacto mágico raro y lo vendiste por **250 de oro**.' },
            { success: true, amount: 100, message: 'Engañaste a un comerciante desprevenido y ganaste **100 de oro**.' },
            { success: false, amount: -75, message: 'Fuiste atrapado robando y pagaste una multa de **75 de oro**.' },
            { success: false, amount: -120, message: 'Una bestia guardiana te atacó y perdiste **120 de oro**.' },
            { success: false, amount: -90, message: 'Tu intento de contrabando fracasó, perdiendo **90 de oro** en sobornos.' }
        ];

        const outcome = outcomes[Math.floor(Math.random() * outcomes.length)];
        const userEconomy = await Economy.findOneAndUpdate(
            { userId: interaction.user.id },
            { $inc: { gold: outcome.amount } },
            { upsert: true, new: true }
        );

        const embed = new EmbedBuilder()
            .setTitle('Crimen')
            .setDescription(outcome.message)
            .setColor(outcome.success ? 'Green' : 'Red')
            .addFields({ name: 'Tu Oro', value: `${userEconomy.gold} de oro` });

        interaction.reply({ embeds: [embed] });
    }
};
