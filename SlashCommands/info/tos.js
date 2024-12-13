const { ApplicationCommandOptionType, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'tos',
    description: 'Muestra los términos de servicio con opciones de idioma.',
    options: [
        {
            name: 'language',
            description: 'Elige el idioma en el que deseas ver los términos de servicio.',
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
                { name: 'Español', value: 'es' },
                { name: 'English', value: 'en' },
                { name: 'Português', value: 'pt' },
            ]
        }
    ],
    run: async (client, interaction) => {
        const selectedLanguage = interaction.options.getString('language');

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
                .setTitle(' Términos de Servicio')
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

        // Enviar embed inicial en el idioma seleccionado
        const embed = createEmbed(selectedLanguage);
        const sentMessage = await interaction.reply({ embeds: [embed], components: [row], fetchReply: true });

        // Crear un collector para escuchar los botones
        const filter = (i) => i.isButton() && i.message.id === sentMessage.id;
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

        collector.on('collect', async (i) => {
            if (i.user.id !== interaction.user.id) {
                return i.reply({ content: 'Solo el autor del comando puede cambiar el idioma.', ephemeral: true });
            }
            let lang = 'es';
            switch (i.customId) {
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
            await i.update({ embeds: [newEmbed], components: [row] });
        });

        collector.on('end', () => {
            row.components.forEach(button => button.setDisabled(true));
            sentMessage.edit({ components: [row] });
        });
    }
};
