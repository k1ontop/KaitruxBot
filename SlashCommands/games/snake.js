const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const { Snake } = require('discord-gamecord');

module.exports = {
  name: 'snake',
  description: 'Inicia un juego de Snake',
  options: [],
  run: async (client, interaction) => {
    new Snake({
      message: interaction,
      slash_command: true,
      embed: {
        title: 'Snake Game',
        overTitle: 'Game Over',
      },
      snake: { head: '🟢', body: '🟢', tail: '🟢' },
      emojis: {
        board: '⬛',
        food: '🍎',
      },
      stopButton: 'Stop',
      othersMessage: 'You are not allowed to use buttons for this message!',
    }).startGame();
  },
};
