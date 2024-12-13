const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const Economy = require('../../schemas/economy.js');
const Pet = require('../../schemas/pet.js');

module.exports = {
    name: 'buy',
    description: 'Compra una mascota de la tienda.',
    options: [
        {
            name: 'pet',
            description: 'Nombre de la mascota que deseas comprar.',
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
                { name: 'Keiv', value: 'keiv' },
                { name: 'Naib', value: 'naib' },
                { name: 'Nairb', value: 'nairb' },
                { name: 'Swash', value: 'swash' }
            ]
        }
    ],
    run: async (client, interaction) => {
        const petPrices = { keiv: 500, naib: 750, nairb: 1000, swash: 3000 };
        const petName = interaction.options.getString('pet');
        const petCost = petPrices[petName];

        // Verificar si ya tiene una mascota
        const existingPet = await Pet.findOne({ userId: interaction.user.id });
        if (existingPet) {
            return interaction.reply('❌ Ya tienes una mascota. No puedes tener más de una.');
        }

        const userEconomy = await Economy.findOne({ userId: interaction.user.id });
        if (!userEconomy || userEconomy.gold < petCost) {
            return interaction.reply('❌ No tienes suficiente oro para comprar esta mascota.');
        }

        // Crear la nueva mascota
        const pet = new Pet({ userId: interaction.user.id, petName, petType: petName, revivals: petName === 'swash' ? 3 : 0 });
        await pet.save();

        // Reducir el oro del usuario
        userEconomy.gold -= petCost;
        await userEconomy.save();

        const embed = new EmbedBuilder()
            .setTitle('Compra Exitosa')
            .setDescription(`✅ Has comprado la mascota **${petName}** por **${petCost}** de oro.`)
            .setColor('Green');

        interaction.reply({ embeds: [embed] });
    }
};
