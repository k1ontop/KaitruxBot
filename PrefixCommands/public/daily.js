const ecoSchema = require(`${process.cwd()}/schemas/economy.js`);
const Discord = require('discord.js');
module.exports = {
    name: "daily",
    desc: "Permite a un usuario reclamar su recompensa diaria",
    run: async (client, message, args, prefix) => {
        const user = message.member;
        let data = await ecoSchema.findOne({userID: user.id});

        const timeout = 86400000; // 24 horas
        const amount = 500; // Cantidad fija

        if (data.daily !== null && timeout - (Date.now() - data.daily) > 0) {
            let time = timeout - (Date.now() - data.daily);
            return message.reply(`❌ **Ya has reclamado tu recompensa diaria! Vuelve en ${Math.floor(time / (1000 * 60 * 60))} horas.**`);
        } else {
            data.dinero += amount;
            data.daily = Date.now();
            await data.save();
            message.reply(`✅ **Has reclamado tu recompensa diaria de ${amount} monedas!**`);
        }
    }
}
