const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const client = require("aflb");
const aflb = new client();

module.exports = {
    name: 'bored',
    description: 'Aburrido',
    options: [],
    run: async (client, interaction) => {
        const author = await interaction.guild.members.fetch(interaction.user.id);
        const dato = await aflb.sfw.bored();

        const embed = new EmbedBuilder()
            .setDescription(`*${author.displayName} está aburrido...*`)
            .setImage(dato)
            .setColor('#ff0000');

        await interaction.reply({ embeds: [embed] });
    },
};
