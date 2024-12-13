const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const { TicTacToe } = require('discord-gamecord');

module.exports = {
    name: "tictactoe",
    description: "Juega al divertido juego de Tic Tac Toe con tus amigos",
    options: [
        {
            name: 'opponent',
            description: 'Elige a tu oponente',
            type: ApplicationCommandOptionType.User,
            required: true
        }
    ],
    run: async (client, interaction) => {
        const opponent = interaction.options.getUser('opponent');

        new TicTacToe({
            message: interaction,
            slash_command: true,
            opponent: opponent,
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
            oEmoji: '',
            xEmoji: '❌',
            blankEmoji: '➖',
            oColor: 'PRIMARY',
            xColor: 'DANGER',
            mentionUser: true,
            timeoutTime: 60000,
            xButtonColor: 'PRIMARY',
            oButtonColor: 'DANGER',
            drawButtonColor: 'SECONDARY',
            requestTimeout: 60000,
            winMessage: 'GG, {winner} ganó!',
            drawMessage: '¡Es un empate!',
            gameEndMessage: 'El juego no se completó :(',
            timeEndMessage: '¡El juego terminó por inactividad!',
            opponentMessage: '¡No puedes jugar contra ti mismo!',
            requestMessage: '¡Hola {opponent}, {challenger} te desafió a un juego de Tic Tac Toe!',
            rejectMessage: '¡El jugador rechazó tu solicitud de juego!',
            returnWinner: false,
        }).startGame();
    }
};
