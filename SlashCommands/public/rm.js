const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const aflb = require("aflb");
const ms = require('ms'); // Asegúrate de instalar ms con npm i ms

module.exports = {
    name: "rm",
    description: "Configura un recordatorio",
    options: [
        {
            name: "tiempo",
            description: "Tiempo hasta el recordatorio (ej. 2h, 30m)",
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: "mensaje",
            description: "El mensaje del recordatorio",
            type: ApplicationCommandOptionType.String,
            required: true,
        }
    ],
    run: async (client, interaction) => {
        const tiempo = interaction.options.getString('tiempo');
        const mensaje = interaction.options.getString('mensaje');
        const delay = ms(tiempo);

        if (!delay) {
            return interaction.reply({
                content: 'El formato de tiempo es incorrecto. Usa algo como "2h" o "30m".',
                ephemeral: true
            });
        }

        const author = interaction.member;

        // Enviar confirmación al usuario
        await interaction.reply({
            content: `⏰ ¡Recordatorio configurado! Te recordaré en ${tiempo}.`,
            ephemeral: true
        });

        // Configurar el temporizador
        setTimeout(async () => {
            try {
                const member = await interaction.guild.members.fetch(interaction.user.id);

                if (member) {
                    // Crear un embed de recordatorio
                    const embed = new EmbedBuilder()
                        .setDescription(`⏰ **Recordatorio** para ${author.displayName}: ${mensaje}`)
                        .setColor("#ffbf00");

                    // Enviar el recordatorio
                    await interaction.followUp({ embeds: [embed] });
                }
            } catch (error) {
                // Manejar el caso en que el usuario ya no está en el servidor
                console.log('El usuario ya no está en el servidor. Recordatorio cancelado.');
            }
        }, delay);
    }
};
