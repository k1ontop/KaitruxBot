const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const Shitpost = require('discord-shitpost');

module.exports = {
    name: 'shitpost',
    description: 'Genera un shitpost',
    options: [
        {
            name: 'tipo',
            description: 'Elige entre video o foto',
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
                { name: 'Foto', value: 'foto' },
                { name: 'Video', value: 'video' }
            ]
        }
    ],

    run: async (client, interaction) => {
        const tipo = interaction.options.getString('tipo');

        if (tipo === 'foto') {
            const imgShitpost = await Shitpost.imgShitpost();
            const embed = new EmbedBuilder()
                .setTitle('Shitpost Foto')
                .setImage(imgShitpost)
                .setColor('#FF4500')
                .setFooter({ text: 'Disfruta tu shitpost!' });
            
            await interaction.reply({ embeds: [embed] });
        } else if (tipo === 'video') {
            const vidShitpost = await Shitpost.vidShitpost();
            
            await interaction.reply(vidShitpost);
        }
    }
};
