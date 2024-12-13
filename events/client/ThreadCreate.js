const { EmbedBuilder } = require('discord.js');
const ForumSetup = require(`${process.cwd()}/schemas/ForumSetup.js`);

module.exports = {
    name: "threadCreate",
    async execute(thread) {
        if (!thread.isThread()) return;

        const guildId = thread.guild.id;

        try {
            const forumSetup = await ForumSetup.findOne({ guildId, categoryId: thread.parentId });

            if (!forumSetup) return;

            const role = thread.guild.roles.cache.get(forumSetup.mentionRoleId);
            const message = forumSetup.messageTemplate
                .replace('{user}', thread.owner.toString())
                .replace('{rol}', role.toString());

            const embed = new EmbedBuilder()
                .setDescription(message)
                .setColor("#00ff00")
                .setTimestamp();

            await thread.send({ embeds: [embed] });
        } catch (error) {
            console.error('Error al enviar el mensaje en el hilo:', error);
        }
    }
};
