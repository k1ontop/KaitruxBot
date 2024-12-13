const { Discord, EmbedBuilder} = require("discord.js")
const client = require("aflb");
const aflb = new client();

module.exports = { 
    name: "angry",
    description: "Enojate",
    usage: "angry",
    run: async (client, message) => { 

        const author = await message.guild.members.fetch(message.author.id) 
    
     const myNekoFunction = async () => { 
      let dato = await aflb.sfw.angry()
        return message.channel.send({
           embeds: [
                new EmbedBuilder()
                .setDescription(`*${author.displayName} se enojo...*`)
                .setImage(dato)
                .setColor("#ff0000")
           ]

        })
        }
        myNekoFunction()
      }
   }