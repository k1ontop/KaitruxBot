const Discord = require("discord.js");
const reportMap = require(`${process.cwd()}/schemas/reportmap.js`); // Importar el esquema de perfil

module.exports = {
  name: "report",
  description: "Report a bug",
  botPerms: ["EmbedLinks"],
  run: async (client, message, args) => {
    const reportchannel = client.channels.cache.get("1244370702803538053");
    const report = args.join(" ");
    if (!report) {
      return message.channel.send(
        "Debes agregar el error que te ha ocurrido (no imagenes)"
      );
    }

    const reportId = Math.floor(Math.random() * 1000000); // Genera una ID única para el reporte

    const embed2 = new Discord.EmbedBuilder()
      .setTitle("Reporte enviado!")
      .setDescription(`El reporte ID: ${reportId}`)
      .setColor("Random");

    message.channel.send({ embeds: [embed2] });

    const embed = new Discord.EmbedBuilder()
      .setTitle(`Reporte ${reportId}`)
      .setDescription(`${report} \n\De: ${message.author.tag}\nId del usuario: ${message.author.id}`)
      .setColor("Random");

    reportchannel.send({ embeds: [embed] });

    reportMap.set(reportId, embed); // Guarda el reporte en el mapa
  },
  catch(error) {
    const errorlogs = client.channels.cache.get("747750993583669258");
    message.channel.send(
      "Looks Like an Error has Ocurred. The Error has been reported to the Report Section!"
    );
    errorlogs.send("Error on Report Command \nError: \n" + error);
  },
};
