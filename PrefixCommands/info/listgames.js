const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'listgames',
    description: 'Lista los juegos que están siendo jugados y los usuarios que los están jugando',
    options: [],
    run: async (client, interaction) => {
        const games = new Map();

        // Recorre todos los miembros del servidor
        interaction.guild.members.cache.forEach(member => {
            // Revisa si el miembro tiene actividad en su presencia
            if (member.presence && member.presence.activities.length > 0) {
                member.presence.activities.forEach(activity => {
                    if (activity.type === 'PLAYING') {
                        // Si el juego ya está en el mapa, agrega el usuario a la lista
                        if (games.has(activity.name)) {
                            games.get(activity.name).push(member.user.tag);
                        } else {
                            // Si el juego no está en el mapa, crea una nueva entrada
                            games.set(activity.name, [member.user.tag]);
                        }
                    }
                });
            }
        });

        // Crea el embed para mostrar los resultados
        const embed = new EmbedBuilder()
            .setTitle('Usuarios jugando:')
            .setColor(0x00AE86);

        // Recorre los juegos y agrega los campos al embed
        games.forEach((users, game) => {
            embed.addFields({ name: `${game} (${users.length})`, value: users.map(user => `-${user}`).join('\n'), inline: false });
        });

        await interaction.reply({ embeds: [embed] });
    },
};
