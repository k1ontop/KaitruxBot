const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const AutoResponse = require(`${process.cwd()}/schemas/autoResponse.js`);

module.exports = {
    name: 'addresponse',
    description: 'Añade una respuesta automática personalizada',
    options: [
        {
            name: 'trigger',
            description: 'La palabra clave o frase que activará la respuesta',
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: 'response',
            description: 'La respuesta automática que el bot enviará',
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ],
    run: async (client, interaction) => {
        const trigger = interaction.options.getString('trigger');
        const response = interaction.options.getString('response');

        const newResponse = new AutoResponse({
            guildId: interaction.guild.id,
            trigger: trigger,
            response: response
        });

        await newResponse.save();

        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Respuesta automática añadida')
            .setDescription(`Trigger: ${trigger}\nResponse: ${response}`)
            .setFooter({ text: 'Sistema de Respuestas Automáticas' });

        interaction.reply({ embeds: [embed], ephemeral: true });
    }
};
