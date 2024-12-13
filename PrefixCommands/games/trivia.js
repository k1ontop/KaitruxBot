const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

// Preguntas de trivia
const triviaQuestions = [
  {
    question: "¿Quién es este famoso futbolista?",
    image: "https://cdn.discordapp.com/attachments/1282080387702456453/1292331539245305977/OIP.jpeg?ex=67035909&is=67020789&hm=bb3053797cd1afb62b97a0a362a6e4ffe1a3774476e724ec24d8a926076a200b&", // Aquí debes poner el enlace de la imagen que has dado
    options: ["Luis Suárez", "Cristiano Ronaldo", "Leo Messi", "Diego Maradona"],
    correct: "Leo Messi"
  },
  // Puedes añadir más preguntas aquí 
  {
    question: "como se llama esta liga?",
    image: "https://cdn.diascordapp.com/attachments/1207358112802017292/1292328263175376937/Ultimativer_Champion.webp?ex=670355fc&is=6702047c&hm=1bfd9a5de7d0a95aa05dddf19222c61864e41a9ae2bbb9a74b894bda00bb76e4&", // Aquí debes poner el enlace de la imagen que has dado
    options: ["Campeones definitivos", "Superliga", "Campeones eternos", "diamante"],
    correct: "Campeones definitivos"
  }
];

module.exports = {
  name: "trivia",
  description: "Inicia una trivia",
  run: async (client, message, args) => {
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

    const triviaMessage = await message.channel.send({ embeds: [triviaEmbed], components: [row] });

    // Crear el collector para los botones
    const filter = (interaction) => {
      return interaction.isButton() && interaction.user.id === message.author.id;
    };

    const collector = triviaMessage.createMessageComponentCollector({
      filter,
      time: 20000 // 20 segundos
    });

    collector.on("collect", async (interaction) => {
      const selectedOptionIndex = interaction.customId.split("_")[1];
      const selectedOption = questionData.options[selectedOptionIndex];

      // Cambiar los colores de los botones
      const updatedRow = new ActionRowBuilder().addComponents(
        questionData.options.map((option, index) => {
          const button = new ButtonBuilder()
            .setCustomId(`option_${index}`)
            .setLabel(option)
            .setDisabled(true); // Desactivar todos los botones después de la elección

          if (option === questionData.correct) {
            return button.setStyle(ButtonStyle.Success); // Verde si es la respuesta correcta
          } else if (index == selectedOptionIndex) {
            return button.setStyle(ButtonStyle.Danger); // Rojo si es la respuesta incorrecta que seleccionó
          } else {
            return button.setStyle(ButtonStyle.Secondary); // Mantén los demás botones desactivados
          }
        })
      );

      await interaction.update({ components: [updatedRow] });

      if (selectedOption === questionData.correct) {
        await interaction.followUp({ content: "¡Correcto! 🎉", ephemeral: true });
      } else {
        await interaction.followUp({ content: `Incorrecto. La respuesta correcta era ${questionData.correct}.`, ephemeral: true });
      }

      collector.stop(); // Finalizar el collector
    });

    collector.on("end", (collected, reason) => {
      if (reason === "time") {
        // Si se acaba el tiempo sin respuesta, desactivar los botones
        const disabledRow = new ActionRowBuilder().addComponents(
          questionData.options.map((option, index) =>
            new ButtonBuilder()
              .setCustomId(`option_${index}`)
              .setLabel(option)
              .setStyle(option === questionData.correct ? ButtonStyle.Success : ButtonStyle.Secondary)
              .setDisabled(true) // Desactivarlos
          )
        );

        triviaMessage.edit({ components: [disabledRow] });
        message.channel.send(`Se acabó el tiempo ⏰. La respuesta correcta era **${questionData.correct}**.`);
      }
    });
  }
};
