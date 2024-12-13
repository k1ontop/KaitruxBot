const { Discord, EmbedBuilder} = require("discord.js")
const client = require("aflb");
const aflb = new client();
const emojis = require(`${process.cwd()}/emojis.json`)

module.exports = { 
    name: "drink",
    description: "Bebe algo..",
    usage: "drink",
    run: async (client, message) => { 

        const author = await message.guild.members.fetch(message.author.id) 
    
     const myNekoFunction = async () => { 
      let dato = await aflb.sfw.drink()
        return message.channel.send({
           embeds: [
                new EmbedBuilder()
                .setDescription(`*${author.displayName} Esta bebiendo..*`)
                .setImage(dato)
                .setColor("#ff0000")
                .setFooter({text:`${emojis.emojis.reir.name} creado con amor por k1 para ustedes <3` })

           ]

        })
        }
        myNekoFunction()
      }
   }