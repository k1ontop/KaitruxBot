const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'massroledelete',
    description: 'Eliminar un rol de todos los miembros del servidor.',
    run: async(message, args) => {
        const role = message.mentions.roles.first();
        if (!role) return message.reply('¡Por favor menciona un rol válido!');

        const members = await message.guild.members.fetch();
        const totalMembers = members.size;
        let processedMembers = 0;

        const embed = new EmbedBuilder()
            .setTitle('Eliminado')
            .setDescription(`**Miembros revisados:** 0/${totalMembers}\n**Tiempo estimado:** en un minuto\n**Rol:** ${role.name}`)
            .setColor('#FF0000');

        const statusMessage = await message.channel.send({ embeds: [embed] });

        for (const member of members.values()) {
            await member.roles.remove(role).catch(console.error);
            processedMembers++;
            embed.setDescription(`**Miembros revisados:** ${processedMembers}/${totalMembers}\n**Tiempo estimado:** en un minuto\n**Rol:** ${role.name}`);
            await statusMessage.edit({ embeds: [embed] });
        }

        embed.setDescription(`Se ha eliminado el rol **${role.name}** de todos los miembros.`);
        await statusMessage.edit({ embeds: [embed] });
    }
};
