const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'embed',
    description: 'Crea un mensaje embed personalizado.',
    usage: '!embed <titulo> | <descripcion> | [footer] | [imagen]',
    aliases: [], // Añade alias si los necesitas
    run: async (client, message, args) => {
        // Combina los argumentos en una sola cadena
        const input = args.join(' ').split('|');

        // Validación de argumentos
        const title = input[0]?.trim();
        const description = input[1]?.trim();
        const footer = input[2]?.trim();
        const image = input[3]?.trim();

        if (!title || !description) {
            return message.reply({
                content: `❌ Uso incorrecto. El formato es: \`!embed <titulo> | <descripcion> | [footer] | [imagen]\``,
                ephemeral: true,
            });
        }

        // Crear el embed
        const embed = new EmbedBuilder()
            .setTitle(title)
            .setDescription(description)
            .setColor('#00FFFF'); // Cambia este color si lo necesitas

        if (footer) embed.setFooter({ text: footer });
        if (image) embed.setImage(image);

        // Enviar el embed al canal
        await message.channel.send({ embeds: [embed] });
    },
};
