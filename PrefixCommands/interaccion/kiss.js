const { Discord, EmbedBuilder } = require("discord.js")
const client = require('aflb');
const aflb = new client();
const kissSchema = require(`${process.cwd()}/schemas/besos.js`)
const config = require(`${process.cwd()}/emojis.json`)

module.exports = {
    name: "kiss",
    description: "Besa a alguien.",
    usage: "kiss <user>",
    run: async (client, message, args) => {

        const user = message.guild.members.cache.get(args[0]) || message.mentions.members.filter(m => m.guild.id == message.guild.id).first()
        if (!user) return message.channel.send({embeds: [new EmbedBuilder()
         .setTitle('❌ Error')
         .setDescription('Creo que quisiste usar ese comando con alguien mas..')
         .setFooter({text: 'Error codigo: #100'})
         .setColor('#FF0000')
     ]});
        const target = await message.guild.members.fetch(user.id)
        const author = await message.guild.members.fetch(message.author.id)

        let data = await kissSchema.findOneAndUpdate({
            $or: [
                { user1: message.author.id, user2: user.id },
                { user1: message.mentions.members.first().id, user2: message.author.id }
            ],
        }, {
            $inc: {
                count: +1
            }
        })

        if (!data) {
            let data = await kissSchema.create({
                user1: message.author.id,
                user2: user.id,
                count: 1
            })


            await data.save()

            const myNekoFunction = async () => {
                let gifData = await aflb.sfw.kiss()
                return message.channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setDescription(`**${author.displayName}** le dió un beso a **${target.user.username}**.\n***${author.user.username}** y **${target.user.username}** se han besado 1 vez.*`)
                            .setImage(gifData)
                            .setColor("#060606")
                    ]
                })
            }
            myNekoFunction()

        } else {
            const myNekoFunction = async () => {
                let gifData = await aflb.sfw.kiss()
                return message.channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setDescription(`**${config.emojis.love.name} ${author.user.username}** le dió un beso a **${target.user.username}**.\n***${author.user.username}** y **${target.user.username}** se han besado ${data.count + 1} veces.*`)
                            .setImage(gifData)
                            .setColor("#060606")
                    ]
                })
            }
            myNekoFunction()
        }
    }
}