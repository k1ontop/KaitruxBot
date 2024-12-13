const { EmbedBuilder } = require("discord.js");
const client = require('aflb');
const aflb = new client();
const hugSchema = require("../../schemas/hug.js");
const emojis = require(`${process.cwd()}/emojis.json`);
const fs = require("fs");
const path = require("path");
const blacklistPath = path.join('./data/blocklist.json');

module.exports = {
    name: "hug",
    description: "abraza a alguien.",
    usage: "hug <user>",
    run: async (client, message, args) => {
        const user = message.guild.members.cache.get(args[0]) || message.mentions.members.filter(m => m.guild.id == message.guild.id).first();
        if (!user) {
            return message.channel.send({
                embeds: [new EmbedBuilder()
                    .setTitle('❌ Error')
                    .setDescription('Creo que quisiste usar ese comando con alguien más...')
                    .setFooter({ text: 'Error código: #100' })
                    .setColor('#FF0000')
                ]
            });
        }

        // Leer la lista de bloqueos
        let blacklist = JSON.parse(fs.readFileSync(blacklistPath, "utf-8"));

        // Verificar si el objetivo ha bloqueado al autor del comando
        const isBlocked = blacklist.blockedInteractions.some(
            (entry) => entry.blockedBy === user.id && entry.blockedUser === message.author.id
        );

        if (isBlocked) {
            return message.reply(`No puedes interactuar con ${user.displayName} porque te ha bloqueado.`);
        }

        const author = await message.guild.members.fetch(message.author.id);

        // Buscar y actualizar la base de datos
        let data = await hugSchema.findOneAndUpdate({
            $or: [
                { user1: message.author.id, user2: user.id },
                { user1: user.id, user2: message.author.id }
            ]
        }, {
            $inc: { count: 1 }
        }, { new: true }); // Devolver el documento actualizado

        if (!data) {
            data = await hugSchema.create({
                user1: message.author.id,
                user2: user.id,
                count: 1
            });

            await data.save();

            const gifData = await aflb.sfw.hug();
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(`**${emojis.emojis.cute.name} ${author.displayName}** le dio un abrazo a **${user.user.username}**.\n***${author.displayName}** y **${user.user.username}** se han abrazado 1 vez.*`)
                        .setImage(gifData)
                        .setColor("#060606")
                ]
            });
        } else {
            const gifData = await aflb.sfw.hug();
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(`**${author.displayName}** le dio un abrazo a **${user.user.username}**.\n***${author.displayName}** y **${user.user.username}** se han abrazado ${data.count} veces.*`)
                        .setImage(gifData)
                        .setColor("#060606")
                ]
            });
        }
    }
};
