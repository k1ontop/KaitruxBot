const { ApplicationCommandOptionType, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const config = require(`${process.cwd()}/emojis.json`);

module.exports = {
    name: "serverinfo",
    description: "Obtén información del servidor",
    options: [],
    run: async (client, interaction) => {
        const guild = interaction.guild;
        const memberCount = guild.memberCount.toString();
        const botCount = guild.members.cache.filter(member => member.user.bot).size.toString();
        const onlineCount = guild.members.cache.filter(member => member.presence?.status !== 'offline').size.toString();
        const offlineCount = guild.members.cache.filter(member => member.presence?.status === 'offline').size.toString();
        const channelCount = guild.channels.cache.size.toString();
        const emojiCount = guild.emojis.cache.size.toString();
        const roleCount = guild.roles.cache.size.toString();
        const createdDate = guild.createdAt.toLocaleDateString();
        const owner = await guild.fetchOwner();

        // Convert verification level to words
        const verifyLevelMap = {
            0: "Sin verificación",
            1: "Bajo",
            2: "Medio",
            3: "Alto",
            4: "Muy alto"
        };
        const verifyLevel = verifyLevelMap[guild.verificationLevel];

        const mainEmbed = new EmbedBuilder()
            .setTitle(':id: ¡Información del servidor!')
            .setDescription(
                `:id: **ID del servidor:** ${guild.id}\n` +
                `:crown: **Dueño/a del servidor:** <@${owner.id}>\n` +
                `:date: **Fecha de creación:** ${createdDate}\n` +
                `:busts_in_silhouette: **Miembros:** ${memberCount}\n` +
                `:speech_balloon: **Canales:** ${channelCount}\n` +
                `:crossed_swords: **Roles:** ${roleCount}\n` +
                `:desert: **Emojis:** ${emojiCount}\n` +
                `:rocket: **Mejoras:** 2\n` + // Supuse 2 mejoras como en la imagen
                `:lock: **Verificación:** ${verifyLevel}`
            )
            .setThumbnail(guild.iconURL({ dynamic: true, size: 512 }))
            .setColor('#ff0000')
            .setFooter({ text: `Pedido por ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });

        const roleEmbed = new EmbedBuilder()
            .setTitle(':crown: Roles del servidor')
            .setDescription(guild.roles.cache.map(role => `${role.name} - ${role.members.size} miembros`).join('\n'))
            .setColor('#00ff00');

        const emojiEmbed = new EmbedBuilder()
            .setTitle(':desert: Emojis del servidor')
            .setDescription(guild.emojis.cache.map(emoji => emoji.toString()).join(' '))
            .setColor('#00ff00');

        const iconEmbed = new EmbedBuilder()
            .setTitle('Icono del servidor')
            .setImage(guild.iconURL({ dynamic: true, size: 512 }))
            .setColor('#00ff00');

        const bannerEmbed = new EmbedBuilder()
            .setTitle('Banner del servidor')
            .setImage(guild.bannerURL({ size: 1024 }))
            .setColor('#00ff00');

        const discoveryEmbed = new EmbedBuilder()
            .setTitle('Descubrimiento del servidor')
            .setDescription('Esta es la sección de descubrimiento del servidor.')
            .setColor('#00ff00');

        const selectMenuRow = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('select')
                    .setPlaceholder('Selecciona una opción')
                    .addOptions([
                        {
                            label: 'Roles',
                            description: 'Ver todos los roles del servidor',
                            value: 'roles',
                        },
                        {
                            label: 'Emojis',
                            description: 'Ver todos los emojis del servidor',
                            value: 'emojis',
                        },
                    ])
            );

        const buttonRow = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('icon')
                    .setLabel('Icono')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('banner')
                    .setLabel('Banner')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('discovery')
                    .setLabel('Descubrimiento')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('mainInfo')
                    .setLabel('Volver a la información principal')
                    .setStyle(ButtonStyle.Secondary)
            );

        await interaction.reply({ embeds: [mainEmbed], components: [selectMenuRow, buttonRow], ephemeral: true });

        const filter = i => i.user.id === interaction.user.id;

        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

        collector.on('collect', async i => {
            if (!i.isSelectMenu() && !i.isButton()) return;

            await i.deferUpdate();

            if (i.customId === 'select') {
                if (i.values[0] === 'roles') {
                    await i.editReply({ embeds: [roleEmbed], components: [selectMenuRow, buttonRow], ephemeral: true });
                } else if (i.values[0] === 'emojis') {
                    await i.editReply({ embeds: [emojiEmbed], components: [selectMenuRow, buttonRow], ephemeral: true });
                }
            } else if (i.customId === 'icon') {
                await i.editReply({ embeds: [iconEmbed], components: [selectMenuRow, buttonRow], ephemeral: true });
            } else if (i.customId === 'banner') {
                await i.editReply({ embeds: [bannerEmbed], components: [selectMenuRow, buttonRow], ephemeral: true });
            } else if (i.customId === 'discovery') {
                await i.editReply({ embeds: [discoveryEmbed], components: [selectMenuRow, buttonRow], ephemeral: true });
            } else if (i.customId === 'mainInfo') {
                await i.editReply({ embeds: [mainEmbed], components: [selectMenuRow, buttonRow], ephemeral: true });
            }
        });

        collector.on('end', collected => {
            selectMenuRow.components.forEach(component => component.setDisabled(true));
            buttonRow.components.forEach(component => component.setDisabled(true));
            interaction.editReply({ components: [selectMenuRow, buttonRow] });
        });
    }
};
