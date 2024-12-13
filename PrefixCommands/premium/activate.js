const PremiumKey = require(`${process.cwd()}/schemas/PremiumKeys.js`);


module.exports = {
  name: "keygen",
  description: "Genera una nueva clave premium",
  ownerOnly: true,
  run: async (client, message, args) => {
    if (!message.member.permissions.has('ADMINISTRATOR')) {
      return message.reply('Solo los administradores pueden generar claves premium.');
    }

    const randomKey = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    const newPremiumKey = new PremiumKey({
      key: randomKey
    });

    await newPremiumKey.save();

    message.reply(`Clave premium generada: \`${randomKey}\``);
  }
};
