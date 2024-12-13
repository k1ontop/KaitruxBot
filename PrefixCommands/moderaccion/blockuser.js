const BlockedUser = require(`${process.cwd()}/schemas/block.js`);

module.exports = {
    name: 'block',
    aliases: ['bloquear'],
    description: 'Bloquea a un usuario para que no pueda interactuar contigo.',
    run: async (client, message, args) => {
        const userToBlock = message.mentions.users.first();
        if (!userToBlock) {
            return message.reply('Debes mencionar a un usuario para bloquear.');
        }

        // Verifica si ya está bloqueado
        const existingBlock = await BlockedUser.findOne({ blockerId: message.author.id, blockedId: userToBlock.id });
        if (existingBlock) {
            return message.reply('Este usuario ya está bloqueado.');
        }

        // Bloquea al usuario
        await BlockedUser.create({
            blockerId: message.author.id,
            blockedId: userToBlock.id,
        });

        message.reply(`Has bloqueado a ${userToBlock.tag}. No podrá interactuar contigo.`);
    },
};
