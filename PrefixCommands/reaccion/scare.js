const { Discord, EmbedBuilder, TimestampStyles} = require("discord.js")
const client = require("aflb");
const aflb = new client();

module.exports = { 
    name: "scared",
    description: "asustado",
    usage: "cringe",
    run: async (client, message) => { 

        const author = await message.guild.members.fetch(message.author.id) 
    
     const myNekoFunction = async () => { 
      let dato = await aflb.sfw.scared()
        return message.channel.send({
           embeds: [
                new EmbedBuilder()
                .setDescription(` *  ${author.displayName} Siente miedo*`)
                .setImage(dato)
                .setColor("#ff0000")
           ]

        })
        }
        myNekoFunction()
      }
   }