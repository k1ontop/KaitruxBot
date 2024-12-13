const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: 'amigos',
    description: 'Mostrar la cantidad de servidores donde estoy y sus usuarios.',
    options: [],

    run: async (client, interaction) => {
        try {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor('#fbd9ff')
                        .setDescription(`Actualmente tengo ${client.users.cache.size} amigos <3\n Y he explorado ${client.guilds.cache.size} mundos diferentes :D`)
                        .setImage('https://cdn.discordapp.com/attachments/1048727522709344377/1050134633406279740/tY5FD5IM.gif')
                ]
            });
        } catch (error) {
            console.error(`${error} || ${this.name} || ${interaction} || ${interaction.user} || ${interaction.guild.name}`);
        }
    }
};
