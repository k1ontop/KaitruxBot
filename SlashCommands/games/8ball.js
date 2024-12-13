// 8ball command
const {ApplicationCommandOptionType} = require('discord.js');


module.exports = {
    name: '8ball',
    description: 'juega a la bola magica',
    options: [
        {
            name: 'user',
            description: 'elige a tu oponente',
            type: ApplicationCommandOptionType.Attachment,
            required: true
        },
         ],
  run: async (interaction) => {
    const question = interaction.options.getString('pregunta');
    if (!question) {
      return interaction.reply("`Usage: /8ball <msg>`");
    }

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

    interaction.reply(
      fortunes[Math.floor(Math.random() * fortunes.length)]
    );
  },
};
