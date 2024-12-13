const { Discord, EmbedBuilder} = require("discord.js")
const client = require("aflb");
const aflb = new client();

module.exports = { 
    name: "love",
    description: "mira la tv",
    usage: "watchtv",
    run: async (client, message) => { 

        const author = await message.guild.members.fetch(message.author.id) 
    
     const myNekoFunction = async () => { 
      let dato = await aflb.sfw.love()
        return message.channel.send({
           embeds: [
                new EmbedBuilder()
                .setDescription(`*${author.displayName} se enamoro..`)
                .setImage(dato)
                .setColor("#ff0000")
           ]

        })
        }
        myNekoFunction()
      }
   }