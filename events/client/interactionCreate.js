const { InteractionType, EmbedBuilder, ChannelType } = require("discord.js");
const ApplicationConfig = require("../../schemas/application.js");
const TicketSetup = require(`${process.cwd()}/schemas/TicketSetup.js`);
const LogConfig = require("../../schemas/log.js");
const WelcomeCard = require("discord-welcome-card");
const fs = require("fs");
const path = require("path");
const DisabledCommand = require(`${process.cwd()}/schemas/disableCommands.js`);

// Ruta de configuración de bienvenida
const configPath = path.join(__dirname, "welcomeConfig.json");
let welcomeConfig = fs.existsSync(configPath) ? JSON.parse(fs.readFileSync(configPath, "utf8")) : {};

// Guardar configuración de bienvenida
function saveConfig() {
    fs.writeFileSync(configPath, JSON.stringify(welcomeConfig, null, 4));
}

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (!interaction.isChatInputCommand() && !interaction.isButton()) return;

        const { guild, channel, user, customId } = interaction;

        if (interaction.isChatInputCommand()) {
            const commandName = interaction.commandName;

            // Verificar si el comando está deshabilitado
            const disabled = await DisabledCommand.findOne({ guildId: guild.id });
            if (disabled && Array.isArray(disabled.disabledSlashCommands) && disabled.disabledSlashCommands.includes(commandName)) {
                return interaction.reply({
                    content: 'Este comando está deshabilitado.',
                    ephemeral: true,
                });
            }

            // Ejecutar el comando
            const command = client.commands.get(commandName);
            if (!command) return;

            try {
                await command.run(interaction);
            } catch (error) {
                console.error(error);
                await interaction.reply({
                    content: '❌ Hubo un error al ejecutar este comando.',
                    ephemeral: true,
                });
            }
        }

        if (interaction.isButton()) {
            if (customId === 'create_ticket') {
                await handleTicketCreation(interaction);
            } else if (customId.startsWith("start_application")) {
                await handleApplication(interaction);
            }
        }
    }
};

// Función para manejar creación de tickets
async function handleTicketCreation(interaction) {
    const guildId = interaction.guild.id;
    try {
        const ticketSetup = await TicketSetup.findOne({ guildId });
        if (!ticketSetup) return;

        const ticketChannel = await interaction.guild.channels.create({
            name: `ticket-${interaction.user.username}`,
            type: ChannelType.GuildText,
            parent: interaction.channel.parent ?? undefined, // Asegurarse de que el padre es válido
            permissionOverwrites: [
                {
                    id: interaction.guild.roles.everyone.id,
                    deny: ['ViewChannel'],
                },
                {
                    id: interaction.user.id,
                    allow: ['ViewChannel'],
                },
                {
                    id: ticketSetup.roleId,
                    allow: ['ViewChannel'],
                }
            ],
        });

        const embed = new EmbedBuilder()
            .setTitle(ticketSetup.title)
            .setDescription(ticketSetup.description)
            .setColor('#00ff00');

        if (ticketSetup.imageUrl) embed.setImage(ticketSetup.imageUrl);
        await ticketChannel.send({ embeds: [embed] });
        await interaction.reply({ content: 'Tu ticket ha sido creado.', ephemeral: true });
    } catch (error) {
        console.error('Error al crear el ticket:', error);
        await interaction.reply({ content: 'Error al crear tu ticket. Intenta de nuevo.', ephemeral: true });
    }
}

// Función para manejar postulaciones
async function handleApplication(interaction) {
    const applicationId = interaction.customId.split(":")[1];
    const applicationConfig = await ApplicationConfig.findOne({ applicationId });
    if (!applicationConfig) {
        return interaction.reply({ content: "❌ No se encontró la configuración de esta postulación.", ephemeral: true });
    }

    const questions = applicationConfig.questions;
    const userResponses = [];

    try {
        await interaction.user.send("¡Hola! Responde las siguientes preguntas para completar tu postulación.");

        for (const [index, question] of questions.entries()) {
            const dmMessage = await interaction.user.send(`**Pregunta ${index + 1}:** ${question}`);
            const response = await dmMessage.channel.awaitMessages({
                filter: (m) => m.author.id === interaction.user.id,
                max: 1,
                time: 60000,
                errors: ["time"]
            });
            userResponses.push({ question, answer: response.first().content });
        }

        const resultChannel = interaction.guild.channels.cache.get(applicationConfig.resultChannelId);
        if (resultChannel) {
            const embed = new EmbedBuilder()
                .setTitle("📋 Nueva Postulación")
                .setDescription(`**Usuario:** ${interaction.user.tag} (${interaction.user.id})`)
                .setColor("#00FF00")
                .setTimestamp();

            userResponses.forEach((response, i) => {
                embed.addFields({ name: `Pregunta ${i + 1}`, value: `**${response.question}**\n${response.answer}` });
            });

            await resultChannel.send({ embeds: [embed] });
            await interaction.user.send("✅ ¡Gracias! Tu postulación ha sido enviada.");
        } else {
            await interaction.user.send("❌ Error: No se encontró el canal de resultados en el servidor.");
        }
    } catch (error) {
        console.error("Error al procesar la postulación:", error);
        await interaction.user.send("❌ Hubo un error al procesar tu postulación. Inténtalo más tarde.");
    }

    await interaction.reply({ content: "📨 Se enviaron las preguntas a tu DM. Responde para completar tu postulación.", ephemeral: true });
}
