const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const Marriage = require('../../schemas/marry.js');

module.exports = {
    name: 'divorce',
    description: 'Divórciate de tu pareja',
    options: [],
    run: async (client, interaction) => {
        const marriage = await Marriage.findOne({
            $or: [
                { userId1: interaction.user.id },
                { userId2: interaction.user.id }
            ]
        });

        if (!marriage) {
            return interaction.reply({ content: 'No estás casado.', ephemeral: true });
        }

        await Marriage.deleteOne({ _id: marriage._id });

        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Divorcio')
            .setDescription('Te has divorciado con éxito.')
            .setFooter({ text: 'Sistema de Divorcio' });

        interaction.reply({ embeds: [embed] });
    }
};
