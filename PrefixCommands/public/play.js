module.exports = {
    name: 'play',
    description: 'Reproduce una canción en el canal de voz',
    run: async (client, message, args) => {
        if (!message.guild) return;
        if (!message.member.voice.channel) {
            return message.channel.send("¡Debes estar en un canal de voz para reproducir música!");
        }

        try {
            await client.DisTube.play(message.member.voice.channel, args.join(" "), {
                member: message.member,
                textChannel: message.channel,
                message
            });
        } catch (error) {
            console.error("Error al reproducir la canción:", error);
            message.channel.send("Ocurrió un error al intentar reproducir la canción.");
        }
    }
};
