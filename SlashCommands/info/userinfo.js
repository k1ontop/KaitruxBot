const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'userinfo',
    description: 'Información de un usuario',
    options: [
        {
            name: 'user',
            description: 'Elige al usuario',
            type: ApplicationCommandOptionType.User,
            required: false
        },
    ],
    run: async (client, interaction) => {
        try {
            const target = interaction.options.getMember('user') || interaction.member;
            const { user, presence, roles } = target;
            const formatter = new Intl.ListFormat("en-GB", { style: "narrow", type: "conjunction" });
            await user.fetch();

            const statusType = {
                idle: "1FJj7pX.png",
                dnd: "fbLqSYv.png",
                online: "JhW7v9d.png",
                invisible: "dibKqth.png"
            };
            const activityType = [
                " *Playing*",
                " *Streaming*",
                " *Listening*",
                " *Watching*",
                "♀️ *Custom*",
                " *Competing in*"
            ];
            const clientType = [
                { name: "desktop", text: "Desktop", emoji: "" },
                { name: "mobile", text: "Mobile", emoji: "" },
                { name: "web", text: "Web", emoji: "" },
                { name: "offline", text: "Offline", emoji: "" }
            ];
            const badges = {
                BugHunterLevel1: "<:BugHunter:1025778237432922212>",
                BugHunterLevel2: "<:BugBuster:1025778236015259810>",
                CertifiedModerator: "<:DiscordCertifiedModerator:1025778239001591818>",
                HypeSquadOnlineHouse1: "<:HypesquadBravery:1025778246329061486>",
                HypeSquadOnlineHouse2: "<:HypesquadBrilliance:1025778247616704532>",
                HypeSquadOnlineHouse3: "<:HypesquadBalance:1025778245087543337>",
                Hypesquad: "<:HypeSquadEventAttendee:1025778249642541167>",
                Partner: "<:DiscordPartner:1025778240427671592>",
                PremiumEarlySupporter: "<:EarlySupporter:1025778243825049650>",
                Staff: "<:DiscordStaff:1025778241929232445>",
                VerifiedBot: "<:VerifiedBot:1025804638135529532>",
                VerifiedDeveloper: "<:VerifiedDeveloper:1025778251127341076>"
            };

            const maxDisplayRoles = (roles, maxFieldLength = 1024) => {
                let totalLength = 0;
                const result = [];
                for (const role of roles) {
                    const roleString = `<@&${role.id}>`;
                    if (roleString.length + totalLength > maxFieldLength) break;
                    totalLength += roleString.length + 1;
                    result.push(roleString);
                }
                return { count: result.length, roles: result };
            };

            const sortedRoles = roles.cache
                .map(role => role)
                .sort((a, b) => b.position - a.position)
                .slice(0, roles.cache.size - 1);

            const clientStatus = presence?.clientStatus instanceof Object ? Object.keys(presence.clientStatus) : ["offline"];
            const userFlags = user.flags?.toArray() || [];
            const deviceFilter = clientType.filter(device => clientStatus.includes(device.name));
            const devices = Array.isArray(deviceFilter) ? deviceFilter : [deviceFilter];

            const { count, roles: displayedRoles } = maxDisplayRoles(sortedRoles);

            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(user.hexAccentColor || "Random")
                        .setAuthor({
                            name: user.tag,
                            iconURL: `https://i.imgur.com/${statusType[presence?.status || "invisible"]}`
                        })
                        .setThumbnail(user.avatarURL({ size: 1024 }))
                        .setImage(user.bannerURL({ size: 1024 }))
                        .addFields(
                            { name: "ID", value: ` ${user.id}` },
                            { name: "Actividad", value: presence?.activities.map(activity => `${activityType[activity.type]} ${activity.name}`).join("\n") || "nop" },
                            { name: "Tiempo en el servidor:", value: ` <t:${parseInt(target.joinedTimestamp / 1000)}:R>`, inline: true },
                            { name: "Fecha de creación:", value: ` <t:${parseInt(user.createdTimestamp / 1000)}:R>`, inline: true },
                            { name: "Nickname", value: `♀️ ${target.nickname || "nop"}`, inline: true },
                            {
                                name: `Roles (${count} de ${sortedRoles.length})`,
                                value: `${displayedRoles.join(" ") || "nop"}`
                            },
                            { name: `Banderas: (${userFlags.length})`, value: userFlags.length ? formatter.format(userFlags.map(flag => `**${badges[flag]}**`)) : "nop" },
                            { name: "Dispositivo:", value: devices.map(device => `${device.emoji} ${device.text}`).join("\n"), inline: true },
                            { name: "Color del perfil:", value: ` ${user.hexAccentColor || "nop"}`, inline: true },
                            { name: "Mejoró el servidor", value: `♀️ ${roles.premiumSubscriberRole ? `desde: <t:${parseInt(target.premiumSinceTimestamp / 1000)}:R>` : "No"}`, inline: true },
                            { name: "Banner:", value: user.bannerURL() ? "** **" : " nop" }
                        )
                ],
                ephemeral: true
            });

        } catch (error) {
            console.error(error);
            await interaction.reply({ content: "Hubo un error al obtener la información del usuario.", ephemeral: true });
        }
    }
};
