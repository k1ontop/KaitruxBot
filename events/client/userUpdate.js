const Vanity = require(`${process.cwd()}/schemas/vanitySchema`);

module.exports = async (client, oldUser, newUser) => {
    const guilds = client.guilds.cache;

    for (const guild of guilds.values()) {
        const settings = await Vanity.findOne({ guildId: guild.id });
        if (!settings) continue;

        const member = guild.members.cache.get(newUser.id);
        if (!member) continue;

        if (newUser.username.includes(settings.vanityUrl) && !member.roles.cache.has(settings.roleId)) {
            member.roles.add(settings.roleId)
                .then(() => console.log(`Rol asignado a ${newUser.tag} en ${guild.name}`))
                .catch(console.error);
        }
    }
};
