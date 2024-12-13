const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'embed',
    description: 'Crea un mensaje embed personalizado.',
    options: [
        {
            name: 'titulo',
            type: 3, // STRING
            description: 'El título del embed.',
            required: true,
        },
        {
            name: 'description',
            type: 3, // STRING
            description: 'La descripción del embed.',
            required: true,
        },
        {
            name: 'footer',
            type: 3, // STRING
            description: 'El texto del pie de página.',
            required: false,
        },
        {
            name: 'image',
            type: 3, // STRING
            description: 'La URL de la imagen.',
            required: false,
        },
    ],
    run: async (client, interaction) => {
        const title = interaction.options.getString('titulo');
        const description = interaction.options.getString('description');
        const footer = interaction.options.getString('footer');
        const image = interaction.options.getString('image');

        const embed = new EmbedBuilder()
            .setTitle(title)
            .setDescription(description)
            .setColor('#00FFFF'); // Puedes cambiar el color por defecto

        if (footer) embed.setFooter({ text: footer });
        if (image) embed.setImage(image);

        await interaction.reply({ embeds: [embed] });
    },
};
