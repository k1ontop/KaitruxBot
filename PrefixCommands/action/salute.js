const { EmbedBuilder } = require("discord.js");
const client = require("aflb");
const aflb = new client();
const emojis = require(`${process.cwd()}/emojis.json`);

module.exports = {
    name: "hi",
    description: "Saluda a alguien o a todo el mundo.",
    usage: "hi <user>",
    run: async (client, message, args) => {
        const user = message.guild.members.cache.get(args[0]) || 
            message.mentions.members.filter(m => m.guild.id === message.guild.id).first();

        const author = await message.guild.members.fetch(message.author.id);

        const myNekoFunction = async () => {
            let dato = await aflb.sfw.salute();
            const embed = new EmbedBuilder()
                .setImage(dato)
                .setDescription(
                    user 
                        ? `*${author.displayName} saluda a ${user.displayName}*`
                        : `*${author.displayName} saluda a todo el mundo*`
                )
                .setColor("#ff0000")
                .setFooter({ text: `${emojis.emojis.reir.name} creado con amor por k1 para ustedes <3` });

            return message.channel.send({ embeds: [embed] });
        };

        myNekoFunction();
    }
};
