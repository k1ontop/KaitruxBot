const { EmbedBuilder } = require('discord.js')

module.exports = {
    name: 'explore',
    description: 'Envía a tu mascota Nairb a explorar por monedas.',
    options: [],
    run: async (client, interaction) => {
        const Pet = require('../../schemas/pet.js');
        const Economy = require('../../schemas/economy.js');

        const userPet = await Pet.findOne({ userId: interaction.user.id });
        if (!userPet || userPet.petName !== 'nairb') {
            return interaction.reply('❌ Necesitas la mascota **Nairb** para usar este comando.');
        }



        const outcomes = [35000, 1000, 0]; // Monedas o muerte
        const probabilities = [0.05, 0.9, 0.05]; // Baja probabilidad de 35k, alta de 1k, pequeña de muerte

        const random = Math.random();
        const outcome = random < probabilities[0] ? 35000 : random < probabilities[0] + probabilities[1] ? 1000 : 'dead';

        const userEconomy = await Economy.findOne({ userId: interaction.user.id });
        if (outcome === 'dead') {
            await userPet.deleteOne();
            return interaction.reply('❌ Tu mascota **Nairb** ha muerto en la exploración.');
        }

        userEconomy.gold += outcome;
        await userEconomy.save();
        interaction.reply(`✅ Tu mascota **Nairb** ha regresado con **${outcome} monedas**.`);
    }
};
