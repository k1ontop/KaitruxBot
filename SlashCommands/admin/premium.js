const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const PremiumUser = require(`${process.cwd()}/schemas/premiumUser.js`);

module.exports = {
    name: 'premium',
    description: 'Accede a funcionalidades premium',
    options: [
        {
            name: 'feature',
            description: 'Función premium a usar',
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
                { name: 'Función 1', value: 'feature1' },
                { name: 'Función 2', value: 'feature2' }
            ]
        }
    ],
    run: async (client, interaction) => {
        const premiumUser = await PremiumUser.findOne({ userId: interaction.user.id });

        if (!premiumUser) {
            return interaction.reply({ content: 'Tu cuenta no es premium.', ephemeral: true });
        }

        const feature = interaction.options.getString('feature');

        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Función Premium')
            .setDescription(`Has accedido a la función premium: ${feature}`)
            .setFooter({ text: 'Sistema Premium' });

        interaction.reply({ embeds: [embed], ephemeral: true });

    }
}