const PrefixSchema = require('../../schemas/prefix.js');

module.exports = {
    name: 'setprefix',
    description: 'Cambia el prefijo del bot en el servidor.',
    options: [
        {
            name: 'nuevo',
            type: 3, // STRING
            description: 'El nuevo prefijo que deseas establecer.',
            required: true,
        },
    ],
    run: async (client, interaction) => {
        const newPrefix = interaction.options.getString('nuevo');
        const guildId = interaction.guild.id;

        // Validar longitud del prefijo
        if (newPrefix.length > 5) {
            return interaction.reply('❌ El prefijo no puede tener más de 5 caracteres.');
        }

        // Guardar el prefijo en la base de datos
        await PrefixSchema.findOneAndUpdate(
            { guildId },
            { prefix: newPrefix },
            { upsert: true, new: true }
        );

        interaction.reply(`✅ El nuevo prefijo del bot es: \`${newPrefix}\``);
    },
};
