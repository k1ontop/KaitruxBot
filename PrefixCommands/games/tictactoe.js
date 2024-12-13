const Discord = require('discord.js');
const { TicTacToe } = require('discord-gamecord');
module.exports = {
    name: "tictactoe",
    aliases: ["ttt", "tt"],
    desc: "Juega al divertido juego de ttt con tus amigos!",
    run: async (client, message, args, prefix) => {
new TicTacToe({
      message: message,
      slash_command: false,
      opponent: message.mentions.users.first(),
      embed: {
        title: 'Tic Tac Toe',
        statusTitle: 'Estado del juego',
        overTitle: 'El juego ha terminado',
        color: "NotQuiteBlack",
      },
      buttons: {
        accept: "Aceptar",
        reject: "Rechazar"
      },
      timeoutTime: 30000,
      oEmoji: '🔵',
      xEmoji: '❌',
      blankEmoji: '➖',
      oColor: 'PRIMARY',
      xColor: 'DANGER',
      mentionUser: true,  // Mencionar al usuario cuando es su turno (verdadero por defecto)
      timeoutTime: 60000,  // Tiempo de espera para que un jugador haga su movimiento (60000 ms por defecto)
      xButtonColor: 'PRIMARY',  // Color del botón para el jugador X
      oButtonColor: 'DANGER',  // Color del botón para el jugador O
      drawButtonColor: 'SECONDARY',  // Color del botón cuando el juego es un empate
      requestTimeout: 60000,  // Tiempo de espera para que el oponente acepte el juego
      winMessage: 'GG, {winner} ganó!',  // Mensaje cuando un jugador gana
      drawMessage: '¡Es un empate!',  // Mensaje cuando hay un empate
      gameEndMessage: 'El juego no se completó :(',  // Mensaje cuando el juego termina sin completarse
      timeEndMessage: '¡El juego terminó por inactividad!',  // Mensaje cuando el juego termina por inactividad
      opponentMessage: '¡No puedes jugar contra ti mismo!',  // Mensaje cuando un jugador intenta jugar contra sí mismo
      requestMessage: '¡Hola {opponent}, {challenger} te desafió a un juego de Tic Tac Toe!',  // Mensaje de desafío
      rejectMessage: '¡El jugador rechazó tu solicitud de juego!',  // Mensaje cuando el oponente rechaza el desafío
      returnWinner: false,  // Si se debe devolver el ganador como resultado del juego (falso por defecto)
    })
    .startGame()
       }
      }