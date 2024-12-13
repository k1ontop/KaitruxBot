const Discord = require("discord.js");
const reportMap = require(`${process.cwd()}/schemas/reportmap.js`); // Importar el esquema de perfil

module.exports = {
  name: "foundreport",
  description: "Find a report by its ID",
  botPerms: ["EmbedLinks"],
  run: async (client, message, args) => {
    const reportId = parseInt(args[0], 10);

    if (!reportId) {
      return message.channel.send("Debes proporcionar una ID de reporte válida.");
    }

    const reportEmbed = reportMap.get(reportId);

    if (!reportEmbed) {
      return message.channel.send("No se encontró ningún reporte con esa ID.");
    }

    message.channel.send({ embeds: [reportEmbed] });
  },
  catch(error) {
    const errorlogs = client.channels.cache.get("747750993583669258");
    message.channel.send(
      "Parece que ocurrió un error. El error ha sido reportado a la sección de reportes!"
    );
    errorlogs.send("Error en el comando FoundReport \nError: \n" + error);
  },
};
