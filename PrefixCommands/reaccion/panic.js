const { Discord, EmbedBuilder} = require("discord.js")
const client = require("aflb");
const aflb = new client();

module.exports = { 
    name: "panic",
    description: "panico",
    usage: "panic",
    run: async (client, message) => { 

        const author = await message.guild.members.fetch(message.author.id) 
    
     const myNekoFunction = async () => { 
      let dato = await aflb.sfw.panic()
        return message.channel.send({
           embeds: [
                new EmbedBuilder()
                .setDescription(`*${author.displayName} siente mucho panico*`)
                .setImage(dato)
                .setColor("#ff0000")
           ]

        })
        }
        myNekoFunction()
      }
   }