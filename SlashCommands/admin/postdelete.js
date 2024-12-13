const { ApplicationCommandOptionType, PermissionsBitField, EmbedBuilder } = require('discord.js');
const PostSchema = require("../../schemas/postSchema");

module.exports = {
    name: 'postdelete',
    description: 'Elimina la postulación actual.',
    options: [
        {
            name: 'application_id',
            description: 'El ID de la postulación que deseas eliminar.',
            type: ApplicationCommandOptionType.String,
            required: false
        }
    ],
    run: async (client, interaction) => {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({
                content: 'No tienes permiso para usar este comando.',
                ephemeral: true
            });
        }

        const applicationId = interaction.options.getString('application_id');
        
        let query = { guildId: interaction.guild.id };
        if (applicationId) {
            query = { applicationId };
        }

        const post = await PostSchema.findOne(query);

        if (!post) {
            return interaction.reply({
                content: 'No se encontró una postulación activa.',
                ephemeral: true
            });
        }

        await PostSchema.deleteOne(query);

        interaction.reply({
            content: `La postulación con ID \`${post.applicationId}\` ha sido eliminada correctamente.`,
            ephemeral: true
        });
    }
};