const { Discord, EmbedBuilder} = require("discord.js")
const client = require("aflb");
const aflb = new client();
const config = require(`${process.cwd()}/emojis.json`)

module.exports = { 
    name: "sing",
    description: "Canta a todo volumen",
    usage: "sing",
    run: async (client, message) => { 

        const author = await message.guild.members.fetch(message.author.id) 
    
     const myNekoFunction = async () => { 
      let dato = await aflb.sfw.sing()
        return message.channel.send({
           embeds: [
                new EmbedBuilder()
                .setDescription(`*${author.displayName} Canta a todo volumen*`)
                .setImage(dato)
                .setColor("#ff0000")
                .setFooter({text:`creado con amor por k1 para ustedes <3` })
           ]

        })
        }
        myNekoFunction()
      }
    }