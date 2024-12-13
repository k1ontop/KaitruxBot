const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const aflb = require("aflb");
const clientAflb = new aflb();
const config = require(`${process.cwd()}/emojis.json`);

module.exports = {
    name: "sing",
    description: "Canta a todo volumen",
    options: [],
    run: async (client, interaction) => {
        const author = interaction.member;
        
        const myNekoFunction = async () => {
            let dato = await clientAflb.sfw.sing();
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(`*${author.displayName} Canta a todo volumen*`)
                        .setImage(dato)
                        .setColor("#ff0000")
                        .setFooter({ text: `creado con amor por k1 para ustedes <3` })
                ]
            });
        };

        myNekoFunction();
    }
};
