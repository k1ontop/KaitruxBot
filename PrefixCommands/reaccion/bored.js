const { Discord, EmbedBuilder} = require("discord.js")
const client = require("aflb");
const aflb = new client();

module.exports = { 
    name: "bored",
    description: "Aburrio",
    usage: "bored",
    run: async (client, message) => { 

        const author = await message.guild.members.fetch(message.author.id) 
    
     const myNekoFunction = async () => { 
      let dato = await aflb.sfw.bored()
        return message.channel.send({
           embeds: [
                new EmbedBuilder()
                .setDescription(`*${author.displayName} Esta aburrido...*`)
                .setImage(dato)
                .setColor("#ff0000")
           ]

        })
        }
        myNekoFunction()
      }
   }