const Economy = require('../../schemas/economy.js');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'work',
    description: 'Realiza un trabajo para ganar oro.',
    options: [],
    run: async (client, interaction) => {
        const outcomes = [
            { success: true, amount: 150, message: 'Trabajaste como herrero y forjaste armas mágicas. Ganaste **150 de oro**.' },
            { success: true, amount: 300, message: 'Protegiste a un comerciante como mercenario y obtuviste **300 de oro**.' },
            { success: true, amount: 200, message: 'Recogiste hierbas raras para un alquimista y ganaste **200 de oro**.' },
            { success: true, amount: 250, message: 'Cazaste monstruos en un bosque cercano y vendiste los materiales por **250 de oro**.' },
            { success: false, amount: -100, message: 'Fallaste en reparar una espada mágica y pagaste **100 de oro** por los daños.' },
            { success: false, amount: -150, message: 'Tu misión de caza falló y gastaste **150 de oro** en pociones.' },
            { success: false, amount: -80, message: 'Un cliente no pagó por tu trabajo como guía. Perdiste **80 de oro**.' },
            { success: false, amount: -120, message: 'Fuiste engañado en un trato y perdiste **120 de oro**.' }
        ];

        const outcome = outcomes[Math.floor(Math.random() * outcomes.length)];
        const userEconomy = await Economy.findOneAndUpdate(
            { userId: interaction.user.id },
            { $inc: { gold: outcome.amount } },
            { new: true, upsert: true }
        );

        const embed = new EmbedBuilder()
            .setTitle('Trabajo')
            .setDescription(outcome.message)
            .setColor(outcome.success ? 'Green' : 'Red')
            .addFields({ name: 'Tu Oro', value: `${userEconomy.gold} de oro` });

        interaction.reply({ embeds: [embed] });
    }
};
