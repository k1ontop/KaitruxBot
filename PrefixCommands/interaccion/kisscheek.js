const { Discord, EmbedBuilder} = require("discord.js")
const client = require("aflb");
const aflb = new client();
const emojis = require(`${process.cwd()}/emojis.json`)

module.exports = { 
    name: "kisscheek",
    description: "besito en la mejilla",
    usage: "kisscheek",
    run: async (client, message, args) => { 
      const user = message.guild.members.cache.get(args[0]) || message.mentions.members.filter(m => m.guild.id == message.guild.id).first()
      if (!user) return message.channel.send({embeds: [new EmbedBuilder()
       .setTitle('❌ Error')
       .setDescription('Creo que quisiste usar ese comando con alguien mas..')
       .setFooter({text: 'Error codigo: #100'})
       .setColor('#FF0000')
   ]});
        const author = await message.guild.members.fetch(message.author.id) 
        const target = await message.guild.members.fetch(user.id)

     const myNekoFunction = async () => { 
      let dato = await aflb.sfw.kissCheek()
        return message.channel.send({
           embeds: [
                new EmbedBuilder()
                .setDescription(`${author.displayName} le dio un beso en la mejilla a ${user.displayName}`)
                .setImage(dato)
                .setColor("#ff0000")
                .setFooter({text: `${emojis.emojis.cute.name} Bot creado por k1 Con amor para ustedes`})
           ]

        })
        }
        myNekoFunction()
      }
   }