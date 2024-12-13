const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const client = require("aflb");
const aflb = new client();

module.exports = {
    name: 'cringe',
    description: 'Pena ajena...',
    options: [],
    run: async (client, interaction) => {
        const author = await interaction.guild.members.fetch(interaction.user.id);
        const dato = await aflb.sfw.cringe();

        const embed = new EmbedBuilder()
            .setDescription(`*A ${author.displayName} le dio pena ajena.*`)
            .setImage(dato)
            .setColor('#ff0000');

        await interaction.reply({ embeds: [embed] });
    },
};
