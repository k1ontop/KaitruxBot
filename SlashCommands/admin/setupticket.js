const { ApplicationCommandOptionType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const TicketSetup = require('../../schemas/TicketSetup.js');

module.exports = {
    name: "setupticket",
    description: "Configura el sistema de tickets",
    options: [
        {
            name: "canal",
            description: "El canal donde se configurará el sistema de tickets",
            type: ApplicationCommandOptionType.Channel,
            required: true
        },
        {
            name: "titulo",
            description: "El título del embed",
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: "descripcion",
            description: "La descripción del embed",
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: "emojidelboton",
            description: "El emoji del botón",
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: "role",
            description: "El rol que será mencionado",
            type: ApplicationCommandOptionType.Role,
            required: true
        },
        {
            name: "mensajedemencion",
            description: "Mensaje opcional de mención",
            type: ApplicationCommandOptionType.String,
            required: false
        }
    ],
    run: async (client, interaction) => {
        const channelId = interaction.options.getChannel('canal').id;
        const title = interaction.options.getString('titulo');
        const description = interaction.options.getString('descripcion');
        const buttonEmoji = interaction.options.getString('emojidelboton');
        const roleId = interaction.options.getRole('role').id;
        const mentionMessage = interaction.options.getString('mensajedemencion') || null;
        const guildId = interaction.guild.id;

        try {
            const ticketSetup = await TicketSetup.findOneAndUpdate(
                { guildId },
                { channelId, title, description, buttonEmoji, roleId, mentionMessage },
                { upsert: true, new: true }
            );

            const embed = new EmbedBuilder()
                .setTitle(title)
                .setDescription(description)
                .setColor('#00ff00');

            const button = new ButtonBuilder()
                .setCustomId('create_ticket')
                .setLabel('Abrir Ticket')
                .setEmoji(buttonEmoji)
                .setStyle(ButtonStyle.Primary);

            const row = new ActionRowBuilder().addComponents(button);

            const channel = client.channels.cache.get(channelId);
            await channel.send({ embeds: [embed], components: [row] });

            await interaction.reply(`El sistema de tickets ha sido configurado correctamente en <#${channelId}>.`);
        } catch (error) {
            console.error(error);
            await interaction.reply('Hubo un error al configurar el sistema de tickets. Por favor, intenta de nuevo más tarde.');
        }
    }
};
