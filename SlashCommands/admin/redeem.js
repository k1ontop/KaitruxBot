const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const PremiumKey = require(`${process.cwd()}/schemas/keys.js`);
const PremiumUser = require(`${process.cwd()}/schemas/premiumUser.js`);

module.exports = {
    name: 'redeemkey',
    description: 'Redime una clave premium para tu usuario',
    options: [
        {
            name: 'key',
            description: 'La clave premium',
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ],
    run: async (client, interaction) => {
        const key = interaction.options.getString('key');
        const premiumKey = await PremiumKey.findOne({ key: key, userId: null });

        if (!premiumKey) {
            return interaction.reply({ content: 'La clave premium no es válida o ya ha sido redimida.', ephemeral: true });
        }

        await PremiumUser.create({ userId: interaction.user.id });
        premiumKey.userId = interaction.user.id;
        premiumKey.redeemedAt = Date.now();
        await premiumKey.save();

        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Clave Premium Redimida')
            .setDescription('¡Tu cuenta ahora es premium!')
            .setFooter({ text: 'Sistema Premium' });

        interaction.reply({ embeds: [embed], ephemeral: true });
    }
}
