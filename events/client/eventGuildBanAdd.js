const Antiraid = require(`${process.cwd()}/schemas/antiraid.js`);
const Whitelist = require(`${process.cwd()}/schemas/whitelist.js`);

module.exports = {
    name: 'guildBanAdd',
    async execute(ban) {
        const { guild, user } = ban;
        const antiraid = await Antiraid.findOne({ guildId: guild.id });

        if (!antiraid?.active) return;

        const logChannel = guild.channels.cache.get(antiraid.logChannelId);

        if (!(await Whitelist.findOne({ guildId: guild.id, userId: user.id }))) {
            if (logChannel) {
                logChannel.send(`🚨 **Usuario baneado:** ${user.tag} (${user.id})`);
            }
        }
    },
};
