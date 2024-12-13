const { ApplicationCommandOptionType } = require('discord.js');
const StaffRole = require('../../schemas/StaffRole.js');

module.exports = {
    name: "setstaffrole",
    description: "Establece el rol del equipo de staff",
    options: [
        {
            name: "rol",
            description: "El rol del equipo de staff",
            type: ApplicationCommandOptionType.Role,
            required: true
        }
    ],
    run: async(client, interaction) => {
        const role = interaction.options.getRole('rol');
        const guildId = interaction.guild.id;

        try {
            const staffRole = await StaffRole.findOneAndUpdate(
                { guildId },
                { roleId: role.id },
                { upsert: true, new: true }
            );

            await interaction.reply(`El rol de staff ha sido establecido a: ${role.name}`);
        } catch (error) {
            console.error(error);
            await interaction.reply('Hubo un error al establecer el rol de staff. Por favor, intenta de nuevo más tarde.');
        }
    }
};
