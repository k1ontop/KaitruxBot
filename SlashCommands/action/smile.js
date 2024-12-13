const { EmbedBuilder } = require('discord.js');
const client = require('aflb');
const aflb = new client();
const emojis = require(`${process.cwd()}/emojis.json`);

module.exports = {
    name: 'smile',
    description: 'Sonríe :)',
    run: async (client, interaction) => {
        const author = interaction.member;
        
        const myNekoFunction = async () => {
            let dato = await aflb.sfw.smile();
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(`*${author.displayName} decidió sonreír :) *`)
                        .setImage(dato)
                        .setColor('#ff0000')
                        .setFooter({ text: `${emojis.emojis.reir.name} Creado con amor por k1 para ustedes <3` })
                ]
            });
        };

        await myNekoFunction();
    }
};
