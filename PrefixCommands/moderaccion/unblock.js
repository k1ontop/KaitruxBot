const BlockedUser = require(`${process.cwd()}/schemas/block.js`);
module.exports = {
  name: 'unblock',
  aliases: ['desbloquear'],
  description: 'Desbloquea a un usuario.',
  run: async (client, message, args) => {
      const userToUnblock = message.mentions.users.first();
      if (!userToUnblock) {
          return message.reply('Debes mencionar a un usuario para desbloquear.');
      }

      // Elimina el bloqueo
      const deleted = await BlockedUser.findOneAndDelete({ blockerId: message.author.id, blockedId: userToUnblock.id });
      if (!deleted) {
          return message.reply('Este usuario no estaba bloqueado.');
      }

      message.reply(`Has desbloqueado a ${userToUnblock.tag}. Ahora puede interactuar contigo.`);
  },
};
