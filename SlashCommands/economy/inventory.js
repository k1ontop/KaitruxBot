const Pet = require('../../schemas/pet.js');
const Economy = require('../../schemas/economy.js');
const { EmbedBuilder } = require('discord.js');
module.exports = {
    name: 'inventory',
    description: 'Muestra tu inventario.',
    options: [],
    run: async (client, interaction) => {
        try {
            const userId = interaction.user.id;

            // Obtener economía y mascota
            const userEconomy = await Economy.findOne({ userId });
            const userPet = await Pet.findOne({ userId });

            // Validar datos
            const coins = userEconomy?.gold || 0;
            const pet = userPet?.petName || 'No tienes una mascota';
            const globalRank = await Economy.countDocuments({ gold: { $gt: coins } }) + 1;

            // Crear embed
            const embed = new EmbedBuilder()
                .setTitle('Tu Inventario')
                .setColor('Blue')
                .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
                .addFields(
                    { name: '💰 Monedas', value: coins.toString(), inline: true },
                    { name: '🐾 Mascota', value: pet, inline: true },
                    { name: '🌍 Rango Global', value: `#${globalRank}`, inline: true }
                );

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            interaction.reply({ content: 'Hubo un error al mostrar tu inventario. Por favor, intenta de nuevo más tarde.', ephemeral: true });
        }
    }
};
