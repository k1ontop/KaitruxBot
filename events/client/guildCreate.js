const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'guildCreate',
    async run(client, guild) {
        // Encuentra el primer canal donde el bot puede enviar mensajes
        const defaultChannel = guild.channels.cache.find(
            channel => 
                channel.type === 0 && // Verifica que sea un canal de texto (GuildText)
                channel.permissionsFor(guild.members.me).has('SendMessages') // El bot tiene permisos de enviar mensajes
        );

        if (!defaultChannel) return; // Si no encuentra un canal donde enviar, sale de la función

        // Crea el embed de bienvenida
        const welcomeEmbed = new EmbedBuilder()
            .setColor('#00FF00') // Color verde
            .setTitle('Buenas buenas!')
            .setDescription(`Muchas gracias por añadirme en el servidor: **${guild.name}**! Estoy aqui para servirles recuerden usar !help para ver todos mis increibles comandos programados por YungK1`)
            .setThumbnail(guild.iconURL({ size: 1024 }))
            .setFooter({ text: 'Creado por Yungk1', iconURL: client.user.displayAvatarURL() })
            .setTimestamp();

        // Envía el mensaje de bienvenida al canal predeterminado
        defaultChannel.send({ embeds: [welcomeEmbed] });
    }
};