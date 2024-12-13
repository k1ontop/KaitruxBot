const { ApplicationCommandOptionType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: 'privacypolicy',
    description: 'Muestra la política de privacidad del bot',
    options: [
        {
            name: 'language',
            description: 'Elige el idioma de la política de privacidad',
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
        const privacyPolicyText = {
            en: "Privacy Policy\n\nBy using this bot, you acknowledge and agree that:\n1. The bot may collect data for functional and analytical purposes.\n2. The user is independent and responsible for their actions while using the bot.\n3. The bot's owner is not liable for any misuse of the bot.\n4. Although the bot does not contain NSFW/GORE content, it may have sensitive material.\n5. Data collected is not shared with third parties and is used only for bot functionality.",
            es: "Política de Privacidad\n\nAl usar este bot, reconoces y aceptas que:\n1. El bot puede recopilar datos para fines funcionales y analíticos.\n2. El usuario es independiente y responsable de sus acciones mientras usa el bot.\n3. El propietario del bot no es responsable por el uso indebido del bot.\n4. Aunque el bot no contiene contenido NSFW/GORE, puede tener material sensible.\n5. Los datos recopilados no se comparten con terceros y solo se usan para el funcionamiento del bot.",
            pt: "Política de Privacidade\n\nAo usar este bot, você reconhece e concorda que:\n1. O bot pode coletar dados para fins funcionais e analíticos.\n2. O usuário é independente e responsável por suas ações ao usar o bot.\n3. O proprietário do bot não é responsável pelo uso indevido do bot.\n4. Embora o bot não contenha conteúdo NSFW/GORE, ele pode ter material sensível.\n5. Os dados coletados não são compartilhados com terceiros e são usados apenas para a funcionalidade do bot."
        };

        const language = interaction.options.getString('language');

        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Privacy Policy')
            .setDescription(privacyPolicyText[language])
            .setFooter({ text: 'Created by Yungk1' });

        const buttons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('privacy-es')
                    .setLabel('Español')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('privacy-en')
                    .setLabel('English')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId('privacy-pt')
                    .setLabel('Português')
                    .setStyle(ButtonStyle.Success)
            );

        const msg = await interaction.reply({ embeds: [embed], components: [buttons], fetchReply: true });

        const filter = (i) => i.isButton() && i.message.id === msg.id;
        const collector = msg.createMessageComponentCollector({ filter, time: 60000 });

        collector.on('collect', async (i) => {
            const lang = i.customId.split('-')[1];
            const updatedEmbed = new EmbedBuilder(embed).setDescription(privacyPolicyText[lang]);
            await i.update({ embeds: [updatedEmbed] });
        });

        collector.on('end', () => {
            buttons.components.forEach(button => button.setDisabled(true));
            msg.edit({ components: [buttons] });
        });
    }
};
