const { ApplicationCommandOptionType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: 'vote',
    description: 'Vota por mi en top.gg',
    run: async (client, interaction) => {
        const embed = new EmbedBuilder()
            .setTitle('Vota por nuestro bot en top.gg')
            .setDescription('¡Tu Voto es importante para mi, por favor hazlo!')
            .setColor('#FF0000')
            .setThumbnail(client.user.displayAvatarURL())
            .setFooter({ text: '¡Gracias por tu apoyo!' });

        const button = new ButtonBuilder()
            .setLabel('Votar')
            .setStyle(ButtonStyle.Link)
            .setURL('https://top.gg/bot/1200646197304631326/vote');

        const row = new ActionRowBuilder().addComponents(button);

        await interaction.reply({ embeds: [embed], components: [row] });
    },
};
