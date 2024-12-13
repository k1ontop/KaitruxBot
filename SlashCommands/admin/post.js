const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const ApplicationConfig = require("../../schemas/application.js");
 
module.exports = {
    name: 'postulacion',
    description: 'Crea un sistema de postulación personalizado.',
    options: [
        {
            name: 'canal_mensaje',
            description: 'Canal donde se enviará el mensaje de postulación.',
            type: ApplicationCommandOptionType.Channel,
            channelTypes: [ChannelType.GuildText],
            required: true
        },
        {
            name: 'mensaje',
            description: 'Mensaje a mostrar en la postulación.',
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: 'canal_resultado',
            description: 'Canal donde se enviarán los resultados.',
            type: ApplicationCommandOptionType.Channel,
            channelTypes: [ChannelType.GuildText],
            required: true
        },
        ...Array.from({ length: 15 }, (_, i) => ({
            name: `pregunta${i + 1}`,
            description: `Pregunta ${i + 1} (opcional)`,
            type: ApplicationCommandOptionType.String,
            required: i < 3
        }))
    ],
    async run(client, interaction) {
        const canalMensaje = interaction.options.getChannel('canal_mensaje');
        const mensaje = interaction.options.getString('mensaje');
        const canalResultado = interaction.options.getChannel('canal_resultado');
        const preguntas = Array.from({ length: 15 }, (_, i) => interaction.options.getString(`pregunta${i + 1}`)).filter(Boolean);

        // Crear configuración de postulación en base de datos
      // Crear configuración de postulación en la base de datos
const applicationId = Math.random().toString(36).substring(2, 10);  // Genera un ID único
await ApplicationConfig.create({
    applicationId,
    guildId: interaction.guild.id,
    resultChannelId: canalResultado.id,
    questions: preguntas,
    userId: interaction.user.id  // <-- Añade el userId aquí
});

        // Crear el embed y botón
        const embed = new EmbedBuilder()
            .setTitle("Formulario de Postulación")
            .setDescription(mensaje)
            .setColor("#00FF00")
            .setTimestamp()
            .setFooter({ text: `ID de postulación: ${applicationId}` });

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`start_application:${applicationId}`)
                    .setLabel("Comenzar postulación")
                    .setStyle(ButtonStyle.Primary)
            );

        await canalMensaje.send({ embeds: [embed], components: [row] });

        await interaction.reply({ content: "✅ Postulación creada exitosamente.", ephemeral: true });
    }
};
