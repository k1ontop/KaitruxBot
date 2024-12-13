const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");

module.exports = {
    name: "achievement",
    description: "Crear un logro de Minecraft personalizado.",
    options: [
        {
            name: 'contenido',
            type: ApplicationCommandOptionType.String,
            description: 'El contenido del logro',
            required: true,
        }
    ],
    run: async (client, interaction) => {
        const contenido = interaction.options.getString('contenido');

        if (!contenido) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("#fbd9ff")
                        .setAuthor({ name: "Error Code: 5260" })
                        .setDescription(`No se ha proporcionado el contenido.\n\nUso correcto del comando:\n\` /achievement <contenido> \``)
                ],
                ephemeral: true
            });
        } else {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("#fbd9ff")
                        .setDescription("¡Has conseguido un nuevo logro!")
                        .setImage(`https://minecraftskinstealer.com/achievement/20/Logro%20Obtenido!/${encodeURIComponent(contenido)}`)
                ]
            });
        }
    }
};
