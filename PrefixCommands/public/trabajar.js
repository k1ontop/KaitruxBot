const ecoSchema = require(`${process.cwd()}/schemas/economy.js`);
const Discord = require('discord.js');
module.exports = {
    name: "trabajar",
    aliases: ["work"],
    desc: "Permite a un usuario trabajar y ganar dinero",
    run: async (client, message, args, prefix) => {
        const user = message.member;
        let data = await ecoSchema.findOne({userID: user.id});
        
        const timeout = 3600000; // 1 hora
        const amount = Math.floor(Math.random() * 500) + 100; // Cantidad aleatoria entre 100 y 600

        if (data.work !== null && timeout - (Date.now() - data.work) > 0) {
            let time = timeout - (Date.now() - data.work);
            return message.reply(`❌ **Ya has trabajado recientemente! Vuelve en ${Math.floor(time / 60000)} minutos.**`);
        } else {
            data.dinero += amount;
            data.work = Date.now();
            await data.save();
            message.reply(`✅ **Has trabajado y ganado ${amount} monedas!**`);
        }
    }
}
