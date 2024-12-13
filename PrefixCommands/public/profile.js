const Profile = require(`${process.cwd()}/schemas/profilexx.js`); // Importar el esquema de perfil
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: 'profile',
    description: 'Muestra tu perfil personalizado',
    run: async (client, message, args) => {
        // Buscar el perfil del usuario en la base de datos
        let userProfile = await Profile.findOne({ userId: message.author.id });

        // Si no existe, crear un nuevo perfil para el usuario
        if (!userProfile) {
            userProfile = new Profile({
                userId: message.author.id,
                commandsUsed: 0,
            });
            await userProfile.save();
        }

        // Crear un embed para mostrar la información
        const profileEmbed = new EmbedBuilder()
            .setTitle(`${message.author.username}'s Perfil`)
            .setColor('Blue')
            .addFields(
                { name: 'Frase', value: userProfile.phrase || 'Ninguna', inline: true },
                { name: 'Club', value: userProfile.club || 'Sin club', inline: true },
                { name: 'Estado Civil', value: userProfile.maritalStatus || 'Soltero/a', inline: true },
                { name: 'Comandos Usados', value: `${userProfile.commandsUsed}`, inline: true },
                { name: 'Registrado Desde', value: new Date(userProfile.registeredAt).toLocaleDateString(), inline: true }
            );

        // Enviar el embed del perfil
        message.channel.send({ embeds: [profileEmbed] });
    }
};
