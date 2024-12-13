const { Discord, EmbedBuilder} = require("discord.js")
const client = require("aflb");
const aflb = new client();
const emojis = require(`${process.cwd()}/emojis.json`)

module.exports = { 
    name: "dance",
    description: "bailecito",
    usage: "drink",
    run: async (client, message) => { 

        const author = await message.guild.members.fetch(message.author.id) 
    
     const myNekoFunction = async () => { 
      let dato = await aflb.sfw.dance()
        return message.channel.send({
           embeds: [
                new EmbedBuilder()
                .setDescription(`*${author.displayName}baila con todo el ritmo ${emojis.emojis.twerk.name}*`)
                .setImage(dato)
                .setColor("#ff0000")
                .setFooter({text:`${emojis.emojis.corazon.name} creado con amor por k1 para ustedes <3` })

           ]

        })
        }
        myNekoFunction()
      }
   }