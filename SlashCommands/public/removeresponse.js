const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const AutoResponse = require(`${process.cwd()}/schemas/autoResponse.js`);

module.exports = {
    name: 'removeresponse',
    description: 'Elimina una respuesta automática personalizada',
    options: [
        {
            name: 'trigger',
            description: 'La palabra clave o frase de la respuesta a eliminar',
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ],
    run: async (client, interaction) => {
        const trigger = interaction.options.getString('trigger');

        const result = await AutoResponse.findOneAndDelete({ guildId: interaction.guild.id, trigger: trigger });

        if (!result) {
            return interaction.reply({ content: 'No se encontró ninguna respuesta automática con ese trigger.', ephemeral: true });
        }

        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Respuesta automática eliminada')
            .setDescription(`Trigger: ${trigger}`)
            .setFooter({ text: 'Sistema de Respuestas Automáticas' });

        interaction.reply({ embeds: [embed], ephemeral: true });
    }
};
