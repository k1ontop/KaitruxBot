const Profile = require('../../schemas/profilexx.js'); // Importar el esquema de perfil
const Marriage = require('../../schemas/marry.js');
const Club = require('../../schemas/club.js');
const Level = require('../../schemas/level.js');
const Pet = require('../../schemas/pet.js');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'profile',
    description: 'Muestra tu perfil personalizado',
    options: [],
    run: async (client, interaction) => {
        try {
            // Buscar el perfil del usuario en la base de datos
            let userProfile = await Profile.findOne({ userId: interaction.user.id });

            if (!userProfile) {
                userProfile = new Profile({
                    userId: interaction.user.id,
                    commandsUsed: 0,
                    registeredAt: new Date()
                });
                await userProfile.save();
            }

            // Buscar datos adicionales
            const levelData = await Level.findOne({ guildId: interaction.guild.id, userId: interaction.user.id });
            const allLevels = await Level.find({ guildId: interaction.guild.id }).sort({ level: -1, xp: -1 }).exec();
            const userRank = allLevels.findIndex(u => u.userId === interaction.user.id) + 1;

            const marriage = await Marriage.findOne({
                $or: [
                    { userId1: interaction.user.id },
                    { userId2: interaction.user.id }
                ]
            });

            let maritalStatus = userProfile.maritalStatus || 'Soltero/a';
            if (marriage) maritalStatus = 'Casado/a';

            const club = await Club.findOne({ members: interaction.user.id });
            let clubName = userProfile.club || 'Sin club';
            if (club) {
                clubName = club.name;
                userProfile.club = clubName;
                await userProfile.save();
            }

            // Obtener mascota del usuario
            const pet = await Pet.findOne({ userId: interaction.user.id });
            const petDisplay = pet
                ? `🐾 **${pet.petName}** (${pet.petType})`
                : 'No tienes mascota';

            // Crear un embed para mostrar la información
            const profileEmbed = new EmbedBuilder()
                .setTitle(`${interaction.user.username}'s Perfil`)
                .setColor('Blue')
                .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
                .addFields(
                    { name: 'Frase', value: userProfile.phrase || 'Ninguna', inline: false },
                    { name: 'Club', value: clubName, inline: false },
                    { name: 'Estado Civil', value: maritalStatus, inline: false },
                    { name: 'Mascota', value: petDisplay, inline: false },
                    { name: 'Comandos Usados', value: `${userProfile.commandsUsed}`, inline: false },
                    { name: 'Registrado Desde', value: new Date(userProfile.registeredAt).toLocaleDateString(), inline: false },
                    { name: 'Nivel', value: levelData ? `Nivel: ${levelData.level}\nXP: ${levelData.xp}` : 'Nivel no registrado', inline: false },
                    { name: 'Rank Global', value: `#${userRank}`, inline: false }
                );

            // Enviar el embed del perfil
            interaction.reply({ embeds: [profileEmbed] });
        } catch (error) {
            console.error(error);
            interaction.reply({ content: 'Hubo un error mostrando tu perfil. Por favor, inténtalo de nuevo más tarde.', ephemeral: true });
        }
    }
};
