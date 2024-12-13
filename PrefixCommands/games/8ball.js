const Discord = module.require("discord.js");

module.exports = {
  name: "8ball",
  description: "Tells you a fortune",
  run: async (client, message, args) => {
    if (args.length == 0)
      return message.channel
        .send("`Usage: =8ball <msg>`")
        .then((msg) =>setTimeout(() => msg.delete(), 2300));

        var fortunes = [
          "Sí.",
          "Es cierto.",
          "Definitivamente es así.",
          "Sin duda.",
          "Sí, definitivamente.",
          "Puedes confiar en ello.",
          "Como yo lo veo, sí.",
          "Muy probablemente.",
          "Perspectiva buena.",
          "Las señales apuntan a que sí.",
          "Respuesta confusa, intenta de nuevo.",
          "Pregunta de nuevo más tarde.",
          "Mejor no decírtelo ahora...",
          "No puedo predecir ahora.",
          "Concéntrate y pregunta de nuevo.",
          "No cuentes con ello.",
          "Mi respuesta es no.",
          "Mis fuentes dicen que no.",
          "Perspectiva no tan buena...",
          "Muy dudoso.",
        ];
        
    await message.channel.send(
      fortunes[Math.floor(Math.random() * fortunes.length)]
    );
  },
};