const { Discord, EmbedBuilder } = require("discord.js");
const client = require("aflb");
const aflb = new client();
const emojis = require(`${process.cwd()}/emojis.json`);

module.exports = {
    name: "wink",
    description: "Guiña el ojo o guiñale a alguien",
    usage: "wink <user>",
    run: async (client, message, args) => {
        const user = message.guild.members.cache.get(args[0]) || 
            message.mentions.members.filter(m => m.guild.id === message.guild.id).first();

        const author = await message.guild.members.fetch(message.author.id);

        const myNekoFunction = async () => {
            let dato = await aflb.sfw.wink();
            const embed = new EmbedBuilder()
                .setDescription(
                    user 
                        ? `${author.displayName} le guiña el ojo a ${user.displayName}` 
                        : `${author.displayName} guiña el ojo`
                )
                .setImage(dato)
                .setColor("#ff0000")
                .setFooter({ text: `${emojis.emojis.rey.name} Bot creado por k1 con amor para ustedes` });

            return message.channel.send({ embeds: [embed] });
        };

        if (!user) {
            return myNekoFunction();
        } else {
            await myNekoFunction();
        }
    },
};
