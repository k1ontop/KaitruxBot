const { Snake } = require('discord-gamecord');
const Discord = require('discord.js');
const { TicTacToe } = require('discord-gamecord');
const config = require(`${process.cwd()}/emojis.json`)

module.exports = {
    name: "snake",
    desc: "Juega al divertido juego de snake!",
    run: async (client, message, args, prefix) => {
const Game = new Snake({
  message: message,
  isSlashGame: false,
  embed: {
    title: 'Juego de la serpiente! 🐍',
    overTitle: `¡Juego terminado, perdiste! ${config.emojis.reir.name}  `,
    color: '#5865F2'
  },
  emojis: {
    board: '⬛',
    food: '🍎',
    up: '⬆️', 
    down: '⬇️',
    left: '⬅️',
    right: '➡️',
  },
  snake: { head: '🟢', body: '🟩', tail: '🟢', over: '💀' },
  foods: ['🍎', '🍇', '🍊', '🫐', '🥕', '🥝', '🌽'],
  stopButton: 'detener',
  timeoutTime: 60000,
  playerOnlyMessage: `Solo {player} Puede usar el boton, espera tu turno! ${config.emojis.porfavor.name} `
});

Game.startGame();
Game.on('gameOver', result => {
  console.log(result);  // =>  { result... }
});
    }
}