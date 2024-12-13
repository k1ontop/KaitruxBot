const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const aflb = require("aflb");
const clientAflb = new aflb();
const emojis = require(`${process.cwd()}/emojis.json`);

module.exports = {
    name: "sipjuice",
    description: "Bebe algo..",
    options: [],
    run: async (client, interaction) => {
        const author = interaction.member;
        
        const myNekoFunction = async () => {
            let dato = await clientAflb.sfw.sipJuice();
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(`*${author.displayName} está bebiendo jugo*`)
                        .setImage(dato)
                        .setColor("#ff0000")
                        .setFooter({ text: `${emojis.emojis.reir.name} creado con amor por k1 para ustedes <3` })
                ]
            });
        };

        myNekoFunction();
    }
};
