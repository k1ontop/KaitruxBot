const { Discord, EmbedBuilder, TimestampStyles} = require("discord.js")
const client = require("aflb");
const aflb = new client();

module.exports = { 
    name: "cringe",
    description: "pena ajena..",
    usage: "cringe",
    run: async (client, message) => { 

        const author = await message.guild.members.fetch(message.author.id) 
    
     const myNekoFunction = async () => { 
      let dato = await aflb.sfw.cringe()
        return message.channel.send({
           embeds: [
                new EmbedBuilder()
                .setDescription(` * A ${author.displayName} Le dio pena ajena.*`)
                .setImage(dato)
                .setColor("#ff0000")
                .setFooter(Timestam)
           ]

        })
        }
        myNekoFunction()
      }
   }