const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'tos',
    alias: ['terms'],
    desc: 'Muestra los términos de servicio con opciones de idioma.',
    run: async (client, message, args) => {
        // Términos y servicios en diferentes idiomas
        const tosTexts = {
            es: "⚠️ **Términos de Servicio**\n\n1. No me hago responsable de las acciones que realices utilizando este bot.\n2. El usuario es independiente y completamente responsable de sus acciones.\n3. Aunque el bot no contiene material NSFW/GORE, puede contener material sensible.\n4. Al usar este bot, aceptas estos términos.",
            en: "⚠️ **Terms of Service**\n\n1. I am not responsible for any actions you take using this bot.\n2. The user is independent and fully responsible for their actions.\n3. Although the bot does not contain NSFW/GORE material, it may contain sensitive content.\n4. By using this bot, you agree to these terms.",
            pt: "⚠️ **Termos de Serviço**\n\n1. Não sou responsável por qualquer ação que você realize usando este bot.\n2. O usuário é independente e totalmente responsável por suas ações.\n3. Embora o bot não contenha material NSFW/GORE, ele pode conter conteúdo sensível.\n4. Ao usar este bot, você concorda com estes termos."
        };

        // Función para crear un embed con el texto de los términos en un idioma específico
        const createEmbed = (lang) => {
            return new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('📜 Términos de Servicio')
                .setDescription(tosTexts[lang])
                .setFooter({ text: 'Creado por Yungk1' });
        };

        // Fila de botones para cambiar de idioma
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('tos_es')
                    .setLabel('Español')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('tos_en')
                    .setLabel('English')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId('tos_pt')
                    .setLabel('Português')
                    .setStyle(ButtonStyle.Success)
            );

        // Enviar embed inicial en español
        const embed = createEmbed('es');
        const sentMessage = await message.reply({ embeds: [embed], components: [row] });

        // Crear un collector para escuchar los botones
        const filter = (interaction) => interaction.isButton() && interaction.message.id === sentMessage.id;
        const collector = message.channel.createMessageComponentCollector({ filter, time: 60000 });

        collector.on('collect', async (interaction) => {
            if (interaction.user.id !== message.author.id) {
                return interaction.reply({ content: 'Solo el autor del comando puede cambiar el idioma.', ephemeral: true });
            }

            let lang = 'es';
            switch (interaction.customId) {
                case 'tos_es':
                    lang = 'es';
                    break;
                case 'tos_en':
                    lang = 'en';
                    break;
                case 'tos_pt':
                    lang = 'pt';
                    break;
            }

            const newEmbed = createEmbed(lang);
            await interaction.update({ embeds: [newEmbed], components: [row] });
        });

        collector.on('end', () => {
            row.components.forEach(button => button.setDisabled(true));
            sentMessage.edit({ components: [row] });
        });
    }
};
