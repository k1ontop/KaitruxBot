const { EmbedBuilder } = require('discord.js');

module.exports = (client) => {
    client.distube.on("playSong", (queue, song) => {
        queue.textChannel.send({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`Reproduciendo \`${song.name}\` - \`${song.formattedDuration}\``)
                    .setThumbnail(song.thumbnail)
                    .setURL(song.url)
                    .setColor("#8400ff")
                    .setFooter({ text: `Añadida por ${song.user.tag}`, iconURL: song.user.displayAvatarURL({ dynamic: true }) })
            ]
        });
    });

    client.distube.on("addSong", (queue, song) => {
        queue.textChannel.send({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`✅ Añadido \`${song.name}\` - \`${song.formattedDuration}\``)
                    .setThumbnail(song.thumbnail)
                    .setURL(song.url)
                    .setColor("#8400ff")
                    .setFooter({ text: `Añadida por ${song.user.tag}`, iconURL: song.user.displayAvatarURL({ dynamic: true }) })
            ]
        });
    });

    client.distube.on("initQueue", (queue) => {
        queue.autoplay = true;
    });
};
