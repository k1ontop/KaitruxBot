const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const aflb = require("aflb");
const clientAflb = new aflb();
const emojis = require(`${process.cwd()}/emojis.json`);

module.exports = {
    name: "smoke",
    description: "Fumar no esta tan mal",
    options: [],
    run: async (client, interaction) => {
        const author = interaction.member;
        
        const myNekoFunction = async () => {
            let dato = await clientAflb.sfw.smoke();
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(`*${author.displayName} está fumando...*`)
                        .setImage(dato)
                        .setColor("#ff0000")
                        .setFooter({ text: `${emojis.emojis.reir.name} Creado con amor por k1 para ustedes <3` })
                ]
            });
        };

        myNekoFunction();
    }
};
