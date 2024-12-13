const { ApplicationCommandOptionType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
module.exports = {
    name: 'shop',
    description: 'Muestra la tienda de Kaitrux Fantasy.',
    run: async (client, interaction) => {
        // Embed inicial
        const initialEmbed = new EmbedBuilder()
            .setTitle('Bienvenido a la tienda de Kaitrux Fantasy')
            .setDescription(
                `Aquí puedes comprar cosas como:\n` +
                `- **Llaves**\n` +
                `- **Mascotas**\n` +
                `- **Cofres**\n` +
                `¡Y por tiempo limitado, **Premium**!\n\n` +
                `Recuerda que puede que no todo salga bien y que en este pequeño mundo puede ser injusto.`
            )
            .setColor('Gold');

        // Embeds de Mascotas
        const petsPage1 = new EmbedBuilder()
            .setTitle('Tienda de Mascotas - Página 1')
            .setColor('Gold')
            .addFields(
                { name: 'Keiv (🔥 Fuego)', value: 'Precio: 500 de oro', inline: false },
                { name: 'Naib (🍀 Fortuna)', value: 'Precio: 750 de oro', inline: false },
                { name: 'Nairb (🌾 Recolección)', value: 'Precio: 1,000 de oro', inline: false },
                { name: 'Ileian (⚡ Potenciador)', value: 'Precio: 1,500 de oro', inline: false },
                { name: 'Swash (💎 Revivir)', value: 'Solo para premium', inline: false }
            );

        const petsPage2 = new EmbedBuilder()
            .setTitle('Tienda de Mascotas - Página 2')
            .setColor('Gold')
            .setDescription('Próximamente...');

        // Embeds de Items
        const itemsPage1 = new EmbedBuilder()
            .setTitle('Tienda de Ítems - Página 1')
            .setColor('Gold')
            .setDescription('Próximamente...');

        const itemsPage2 = new EmbedBuilder()
            .setTitle('Tienda de Ítems - Página 2')
            .setColor('Gold')
            .setDescription('Próximamente...');

        // Embed de ¿Cómo comprar?
        const howToBuyEmbed = new EmbedBuilder()
            .setTitle('¿Cómo comprar?')
            .setDescription('Puedes comprar con el comando `/buy`.')
            .setColor('Gold');

        // Botones para la paginación
        const buttons = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('prev')
                .setLabel('⬅️ Anterior')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(true),
            new ButtonBuilder()
                .setCustomId('next')
                .setLabel('➡️ Siguiente')
                .setStyle(ButtonStyle.Primary)
        );

        // Configuración inicial
        let currentPage = 0;
        const embeds = [petsPage1, petsPage2, itemsPage1, itemsPage2, howToBuyEmbed];

        // Responder con el embed inicial
        const message = await interaction.reply({
            embeds: [initialEmbed],
            components: [buttons],
            fetchReply: true,
        });

        // Collector para manejar la paginación
        const filter = (i) => i.user.id === interaction.user.id;
        const collector = message.createMessageComponentCollector({ filter, time: 60000 });

        collector.on('collect', async (i) => {
            if (i.customId === 'next') currentPage++;
            if (i.customId === 'prev') currentPage--;

            await i.update({
                embeds: [embeds[currentPage]],
                components: [
                    new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                            .setCustomId('prev')
                            .setLabel('⬅️')
                            .setStyle(ButtonStyle.Primary)
                            .setDisabled(currentPage === 0),
                        new ButtonBuilder()
                            .setCustomId('next')
                            .setLabel('➡️')
                            .setStyle(ButtonStyle.Primary)
                            .setDisabled(currentPage === embeds.length - 1)
                    ),
                ],
            });
        });

        collector.on('end', () => {
            message.edit({ components: [] });
        });
    },
};
