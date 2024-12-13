const { EmbedBuilder } = require("discord.js");
const client = require("aflb");
const aflb = new client();
const emojis = require(`${process.cwd()}/emojis.json`);

module.exports = {
    name: "nya",
    description: "maulla",
    usage: "nya",
    run: async (client, message) => {
        const author = await message.guild.members.fetch(message.author.id);

        const myNekoFunction = async () => {
            let dato = await aflb.sfw.nya();
            await message.delete(); // Elimina el mensaje con el comando

            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(`*${author.displayName} empezó a maullar como gato ${emojis.emojis.excitado.name}*`)
                        .setImage(dato)
                        .setColor("#ff0000")
                        .setFooter({ text: `Comando secreto 1/5 :0` }),
                ],
            });
        };

        myNekoFunction();
    },
};
