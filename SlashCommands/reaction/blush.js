const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const client = require("aflb");
const aflb = new client();

module.exports = {
    name: "blush",
    description: "Sonrojao",
    options: [],
    run: async (client, interaction) => {
        const author = interaction.member;

        const myNekoFunction = async () => {
            let dato = await clientAflb.sfw.blush();
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(`*${author.displayName} se sonrojó.. U//U*`)
                        .setImage(dato)
                        .setColor("#ff0000")
                ]
            });
        };

        myNekoFunction();
    }
};
