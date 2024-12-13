const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const os = require('os');

module.exports = {
    name: 'botinfo',
    description: 'Muestra información detallada del bot',
    options: [],
    run: async (client, interaction) => {
        const uptime = process.uptime();
        const days = Math.floor(uptime / 86400);
        const hours = Math.floor(uptime / 3600) % 24;
        const minutes = Math.floor(uptime / 60) % 60;
        const seconds = Math.floor(uptime % 60);

        const totalMemory = os.totalmem() / 1024 / 1024; // Total Memory in MB
        const freeMemory = os.freemem() / 1024 / 1024; // Free Memory in MB
        const usedMemory = totalMemory - freeMemory;

        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Información del Bot')
            .addFields(
                { name: 'Ping', value: `${Math.round(client.ws.ping)}ms`, inline: true },
                { name: 'Tiempo de actividad', value: `${days}d ${hours}h ${minutes}m ${seconds}s`, inline: true },
                { name: 'Servidores', value: `${client.guilds.cache.size}`, inline: true },
                { name: 'Usuarios', value: `${client.users.cache.size}`, inline: true },
                { name: 'Canales', value: `${client.channels.cache.size}`, inline: true },
                { name: 'Uso de Memoria', value: `${usedMemory.toFixed(2)} MB / ${totalMemory.toFixed(2)} MB`, inline: true },
                { name: 'Versión de Node.js', value: `${process.version}`, inline: true },
                { name: 'Sistema Operativo', value: `${os.type()} ${os.release()}`, inline: true }
            )
            .setTimestamp()
            .setFooter({ text: `Solicitado por ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });

        await interaction.reply({ embeds: [embed] });
    }
};
