const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const client = require("aflb");
const aflb = new client();

module.exports = {
    name: 'happy',
    description: 'Alegre',
    options: [],
    run: async (client, interaction) => {
        const author = await interaction.guild.members.fetch(interaction.user.id);
        const dato = await aflb.sfw.happy();

        const embed = new EmbedBuilder()
            .setDescription(`*${author.displayName} está feliz <3*`)
            .setImage(dato)
            .setColor('#ff0000');

        await interaction.reply({ embeds: [embed] });
    },
};
