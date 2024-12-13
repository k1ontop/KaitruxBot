const { Discord, EmbedBuilder, TimestampStyles} = require("discord.js")
const client = require("aflb");
const aflb = new client();

module.exports = { 
    name: "cry",
    description: "llora",
    usage: "cry",
    run: async (client, message) => { 

        const author = await message.guild.members.fetch(message.author.id) 
    
     const myNekoFunction = async () => { 
      let dato = await aflb.sfw.cry()
        return message.channel.send({
           embeds: [
                new EmbedBuilder()
                .setDescription(` *  ${author.displayName} se puso triste :c *`)
                .setImage(dato)
                .setColor("#ff0000")
           ]

        })
        }
        myNekoFunction()
      }
   }