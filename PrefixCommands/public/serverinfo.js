const Discord = require("discord.js");

module.exports = {
    name: "serverinfo",
    description: "example command",
    run: async(client, message) => {
        const guild = message.guild;
        const name = guild.name;
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

        const mainEmbed = new Discord.EmbedBuilder()
        .setTitle(':id: ¡Información del servidor!')
        .setDescription(
            `:id: **ID del servidor:** ${guild.id}\n` +
            `:crown: **Dueño/a del servidor:** <@${owner.id}>\n` +
            `:date: **Fecha de creación:** ${createdDate}\n` +
            `:busts_in_silhouette: **Miembros:** ${memberCount}\n` +
            `:speech_balloon: **Canales:** ${channelCount}\n` +
            `:crossed_swords: **Roles:** ${roleCount}\n` +
            `:desert: **Emojis:** ${emojiCount}\n` +
            `:rocket: **Mejoras:** 2\n` +  // Supuse 2 mejoras como en la imagen
            `:lock: **Verificación:** ${verifyLevel}`
        )
        .setThumbnail(guild.iconURL({ dynamic: true, size: 512 }))
        .setColor('#ff0000')
        .setFooter({ text: `Pedido por ${message.author.username}` });

        const roleEmbed = new Discord.EmbedBuilder()
        .setTitle(':crown: Roles del servidor')
        .setDescription(guild.roles.cache.map(role => `${role.name} - ${role.members.size} miembros`).join('\n'))
        .setColor('#00ff00');

        const emojiEmbed = new Discord.EmbedBuilder()
        .setTitle(':desert: Emojis del servidor')
        .setDescription(guild.emojis.cache.map(emoji => emoji.toString()).join(' '))
        .setColor('#00ff00');

        const iconEmbed = new Discord.EmbedBuilder()
        .setTitle('Icono del servidor')
        .setImage(guild.iconURL({ dynamic: true, size: 512 }))
        .setColor('#00ff00');

        const bannerEmbed = new Discord.EmbedBuilder()
        .setTitle('Banner del servidor')
        .setImage(guild.bannerURL({ size: 1024 }))
        .setColor('#00ff00');

        const discoveryEmbed = new Discord.EmbedBuilder()
        .setTitle('Descubrimiento del servidor')
        .setDescription('Esta es la sección de descubrimiento del servidor.')
        .setColor('#00ff00');

        const selectMenuRow = new Discord.ActionRowBuilder()
        .addComponents(
            new Discord.StringSelectMenuBuilder()
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

        const buttonRow = new Discord.ActionRowBuilder()
        .addComponents(
            new Discord.ButtonBuilder()
                .setCustomId('icon')
                .setLabel('Icono')
                .setStyle(Discord.ButtonStyle.Primary),
            new Discord.ButtonBuilder()
                .setCustomId('banner')
                .setLabel('Banner')
                .setStyle(Discord.ButtonStyle.Primary),
            new Discord.ButtonBuilder()
                .setCustomId('discovery')
                .setLabel('Descubrimiento')
                .setStyle(Discord.ButtonStyle.Primary),
            new Discord.ButtonBuilder()
                .setCustomId('mainInfo')
                .setLabel('Volver a la información principal')
                .setStyle(Discord.ButtonStyle.Secondary)
        );

        const messageResponse = await message.channel.send({ embeds: [mainEmbed], components: [selectMenuRow, buttonRow] });

        const filter = interaction => interaction.user.id === message.author.id;

        const collector = messageResponse.createMessageComponentCollector({ filter, time: 60000 });

        collector.on('collect', async interaction => {
            if (!interaction.isSelectMenu() && !interaction.isButton()) return;

            await interaction.deferUpdate();

            if (interaction.customId === 'select') {
                if (interaction.values[0] === 'roles') {
                    await interaction.editReply({ embeds: [roleEmbed], components: [selectMenuRow, buttonRow] });
                } else if (interaction.values[0] === 'emojis') {
                    await interaction.editReply({ embeds: [emojiEmbed], components: [selectMenuRow, buttonRow] });
                }
            } else if (interaction.customId === 'icon') {
                await interaction.editReply({ embeds: [iconEmbed], components: [selectMenuRow, buttonRow] });
            } else if (interaction.customId === 'banner') {
                await interaction.editReply({ embeds: [bannerEmbed], components: [selectMenuRow, buttonRow] });
            } else if (interaction.customId === 'discovery') {
                await interaction.editReply({ embeds: [discoveryEmbed], components: [selectMenuRow, buttonRow] });
            } else if (interaction.customId === 'mainInfo') {
                await interaction.editReply({ embeds: [mainEmbed], components: [selectMenuRow, buttonRow] });
            }
        });

        collector.on('end', collected => {
            selectMenuRow.components.forEach(component => component.setDisabled(true));
            buttonRow.components.forEach(component => component.setDisabled(true));
            messageResponse.edit({ components: [selectMenuRow, buttonRow] });
        });
    }
};
