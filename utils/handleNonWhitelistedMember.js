const Whitelist = require(`${process.cwd()}/schemas/whitelist.js`);

async function handleNonWhitelistedMember(guild, userId, reason) {
    try {
        const member = await guild.members.fetch(userId).catch(() => null);
        if (!member || member.id === guild.ownerId) return; // Ignorar al dueño

        const isWhitelisted = await Whitelist.findOne({
            guildId: guild.id,
            userId,
        });

        if (!isWhitelisted) {
            // Remover roles
            await member.roles.set([], reason).catch(() => {
                console.error(`No se pudieron quitar los roles del usuario ${userId}`);
            });
        }
    } catch (error) {
        console.error(`Error al manejar a un miembro no autorizado: ${error}`);
    }
}

module.exports = handleNonWhitelistedMember;
