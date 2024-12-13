const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const PremiumUser = require('../../schemas/premiumUser.js');
const Pet = require('../../schemas/pet.js');
module.exports = {
    name: 'premium-claimpet',
    description: 'Acciones premium disponibles.',
    options: [
        {
            name: 'claimpet',
            description: 'Reclama la mascota premium Swash.',
            type: ApplicationCommandOptionType.Subcommand
        }
    ],
    run: async (client, interaction) => {

        const isPremium = await PremiumUser.findOne({ userId: interaction.user.id });

        if (!isPremium) {
            return interaction.reply('❌ Este comando es exclusivo para usuarios premium.');
        }

        const existingPet = await Pet.findOne({ userId: interaction.user.id, petType: 'swash' });
        if (existingPet) {
            return interaction.reply('❌ Ya tienes la mascota premium Swash.');
        }

        const pet = new Pet({ userId: interaction.user.id, petName: 'Swash', petType: 'swash' });
        await pet.save();

        interaction.reply('✅ Has reclamado tu mascota premium: **Swash**.');
    }
};
