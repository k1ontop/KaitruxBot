const Profile = require('../../schemas/profilexx.js'); // Importar el esquema de perfil
const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'setphrase',
    description: 'Establece tu frase personalizada',
    options: [
        {
            name: 'phrase',
            description: 'La frase que deseas establecer',
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ],
    run: async (client, interaction) => {
        const newPhrase = interaction.options.getString('phrase');

        let userProfile = await Profile.findOne({ userId: interaction.user.id });
        if (!userProfile) {
            return interaction.reply({ content: 'No tienes un perfil creado. Usa el comando /profile primero.', ephemeral: true });
        }

        userProfile.phrase = newPhrase;
        await userProfile.save();

        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Frase Actualizada')
            .setDescription(`Tu nueva frase es: "${newPhrase}"`);

        interaction.reply({ embeds: [embed], ephemeral: true });
    }
};
