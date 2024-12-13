const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const aflb = require("aflb");
const clientAflb = new aflb();
const emojis = require(`${process.cwd()}/emojis.json`);

module.exports = {
    name: "salute",
    description: "Saluda a todos.",
    options: [],
    run: async (client, interaction) => {
        const author = interaction.member;
        
        const myNekoFunction = async () => {
            let dato = await clientAflb.sfw.salute();
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(`*${author.displayName} decidió saludar a todos!*`)
                        .setImage(dato)
                        .setColor("#ff0000")
                        .setFooter({ text: `${emojis.emojis.reir.name} Creado con amor por k1 para ustedes <3` })
                ]
            });
        };

        myNekoFunction();
    }
};
