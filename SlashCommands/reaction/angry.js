const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const aflb = require("aflb");
const clientAflb = new aflb();

module.exports = {
    name: "angry",
    description: "Enójate",
    options: [],
    run: async (client, interaction) => {
        const author = interaction.member;

        const myNekoFunction = async () => {
            let dato = await clientAflb.sfw.angry();
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(`*${author.displayName} se enojó...*`)
                        .setImage(dato)
                        .setColor("#ff0000")
                ]
            });
        };

        myNekoFunction();
    }
};
