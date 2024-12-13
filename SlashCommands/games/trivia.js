const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

// Preguntas de trivia
const triviaQuestions = [
  {
    question: "¿Quién es este famoso futbolista?",
    image: "https://discord.com/channels/1244370702803538050/1298636713765371985/1298639423357059072",
    correct: "Leo Messi"
  },
  {
    question: "¿Cómo se llama esta liga?",
    image: "https://cdn.discordapp.com/attachments/1207358112802017292/1292328263175376937/Ultimativer_Champion.webp",
    options: ["Campeones definitivos", "Superliga", "Campeones eternos", "Diamante"],
    correct: "Campeones definitivos"
  },
  {
    question: "¿Cuál es la liga profesional de League of Legends en Norteamérica?",
    image: "https://media.discordapp.net/attachments/1298636713765371985/1298639669051002900/OIP.jpeg?ex=671a4bf0&is=6718fa70&hm=2c5715fc738f38e64b2e9a45ab3246c59e68dac3420c903fe513dc341c561e59&=&format=webp&width=244&height=144",
    options: ["LEC", "LCK", "LCS", "CBLOL"],
    correct: "LCS"
  },
  {
    question: "Cual es la copa mas importante de lol?",
    image: "https://media.discordapp.net/attachments/1298636713765371985/1298639668811923527/5054_iemtrophy_356726.jpg?ex=671a4bf0&is=6718fa70&hm=56155bf2f4f4afed185088e4d9ccafb25cfbbaca53636f0c9ca3a18d42abae91&=&format=webp&width=720&height=376",
    options: ["MSI", "Worlds", "All-Stars", "LPL"],
    correct: "Worlds"
  }
];

// Almacenamiento temporal de victorias y derrotas por usuario
const userStats = {};

module.exports = {
  name: "trivia",
  description: "Inicia una trivia",
  options: [],
  run: async (client, interaction) => {
    const questionData = triviaQuestions[Math.floor(Math.random() * triviaQuestions.length)];

    const triviaEmbed = new EmbedBuilder()
      .setTitle(questionData.question)
      .setImage(questionData.image)
      .setColor("#0099ff")
      .setFooter({ text: "Tienes 20 segundos para responder." });

    // Crear los botones de las opciones
    const row = new ActionRowBuilder().addComponents(
      questionData.options.map((option, index) =>
        new ButtonBuilder()
          .setCustomId(`option_${index}`)
          .setLabel(option)
          .setStyle(ButtonStyle.Primary) // Azul por defecto
      )
    );

    const triviaMessage = await interaction.reply({ embeds: [triviaEmbed], components: [row], fetchReply: true });

    // Crear el collector para los botones
    const filter = (btnInteraction) => {
      return btnInteraction.isButton() && btnInteraction.user.id === interaction.user.id;
    };

    const collector = triviaMessage.createMessageComponentCollector({
      filter,
      time: 20000 // 20 segundos
    });

    collector.on("collect", async (btnInteraction) => {
      const selectedOptionIndex = btnInteraction.customId.split("_")[1];
      const selectedOption = questionData.options[selectedOptionIndex];

      // Cambiar los colores de los botones
      const updatedRow = new ActionRowBuilder().addComponents(
        questionData.options.map((option, index) => {
          const button = new ButtonBuilder()
            .setCustomId(`option_${index}`)
            .setLabel(option)
            .setDisabled(true);
          if (option === questionData.correct) {
            return button.setStyle(ButtonStyle.Success);
          } else if (index == selectedOptionIndex) {
            return button.setStyle(ButtonStyle.Danger);
          } else {
            return button.setStyle(ButtonStyle.Secondary);
          }
        })
      );

      await interaction.editReply({ components: [updatedRow] });

      // Registrar victorias y derrotas
      if (!userStats[interaction.user.id]) {
        userStats[interaction.user.id] = { wins: 0, losses: 0 };
      }

      if (selectedOption === questionData.correct) {
        userStats[interaction.user.id].wins += 1;
        await interaction.followUp({ content: "¡Correcto! 🎉", ephemeral: true });
      } else {
        userStats[interaction.user.id].losses += 1;
        await interaction.followUp({ content: `Incorrecto. La respuesta correcta era ${questionData.correct}.`, ephemeral: true });
      }

      collector.stop();
    });

    collector.on("end", (collected, reason) => {
      if (reason === "time") {
        const disabledRow = new ActionRowBuilder().addComponents(
          questionData.options.map((option, index) =>
            new ButtonBuilder()
              .setCustomId(`option_${index}`)
              .setLabel(option)
              .setStyle(option === questionData.correct ? ButtonStyle.Success : ButtonStyle.Secondary)
              .setDisabled(true)
          )
        );

        triviaMessage.edit({ components: [disabledRow] });
        interaction.channel.send(`Se acabó el tiempo ⏰. La respuesta correcta era **${questionData.correct}**.`);
      }
    });
  }
};
