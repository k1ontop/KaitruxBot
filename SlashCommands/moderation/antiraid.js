const Antiraid = require(`${process.cwd()}/schemas/antiraid.js`);
const { ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: 'activar-antiraid',
    description: 'Activa funciones específicas del sistema Anti-Raid',
    options: [
        {
            name: 'funcion',
            type: ApplicationCommandOptionType.String,
            description: 'Función a activar (roleCreate, roleDelete, hierarchyChange)',
            required: true,
        },
    ],
    run: async (interaction) => {
        const guildId = interaction.guild.id;
        const funcion = interaction.options.getString('funcion');

        const validFunctions = ['roleCreate', 'roleDelete', 'hierarchyChange'];
        if (!validFunctions.includes(funcion)) {
            return interaction.reply({
                content: `❌ Función no válida. Opciones: ${validFunctions.join(', ')}`,
                ephemeral: true,
            });
        }

        let antiraid = await Antiraid.findOne({ guildId });
        if (!antiraid) {
            antiraid = await Antiraid.create({ guildId, functions: [funcion] });
        } else {
            if (!antiraid.functions.includes(funcion)) {
                antiraid.functions.push(funcion);
                await antiraid.save();
            }
        }

        return interaction.reply({
            content: `✅ Función **${funcion}** activada en el sistema Anti-Raid.`,
            ephemeral: true,
        });
    },
};
