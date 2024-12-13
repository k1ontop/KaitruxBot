const Marriage = require(`${process.cwd()}/schemas/marry.js`);

module.exports = {
    name: 'marry',
    description: 'Proponer matrimonio a otro usuario.',
    run: async (client, message, args, prefix) => {
        const targetUser = message.mentions.users.first();
        if (!targetUser) return message.reply('Debes mencionar a alguien para proponerle matrimonio.');
        
        const existingMarriage = await Marriage.findOne({
            proposerId: message.author.id,
            status: 'proposed'
        });

        if (existingMarriage) {
            return message.reply('Ya tienes una propuesta de matrimonio pendiente.');
        }

        const newProposal = new Marriage({
            proposerId: message.author.id,
            partnerId: targetUser.id,
            status: 'proposed'
        });

        await newProposal.save();
        message.reply(`Has propuesto matrimonio a ${targetUser.username}. Espera su respuesta.`);
    }
};