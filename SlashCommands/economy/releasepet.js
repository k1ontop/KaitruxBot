const { EmbedBuilder } = require('discord.js');
const Economy = require('../../schemas/economy.js');
const Pet = require('../../schemas/pet.js');

module.exports = {
    name: 'releasepet',
    description: 'Libera a tu mascota actual.',
    options: [],
    run: async (client, interaction) => {
        try {
            const userId = interaction.user.id;

            // Verificar si el usuario tiene una mascota
            const userPet = await Pet.findOne({ userId });

            if (!userPet) {
                return interaction.reply({
                    content: '❌ No tienes ninguna mascota para liberar.',
                    ephemeral: true
                });
            }

            // Guardar el nombre de la mascota antes de eliminarla
            const petName = userPet.petName;

            // Eliminar la mascota del usuario
            await Pet.deleteOne({ userId });

            // Confirmar liberación con embed
            const embed = new EmbedBuilder()
                .setTitle('🐾 Mascota Liberada')
                .setDescription(`Tu mascota **${petName}** ha sido liberada con éxito.`)
                .setColor('Green');

            return interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            return interaction.reply({
                content: '❌ Ocurrió un error al intentar liberar tu mascota. Por favor, inténtalo de nuevo más tarde.',
                ephemeral: true
            });
        }
    }
};
