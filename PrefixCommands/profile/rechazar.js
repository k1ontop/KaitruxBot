const Profile = require(`${process.cwd()}/schemas/marry.js`);
module.exports = {
    name: 'rechazarpropuesta',
    description: 'Rechazar una propuesta de matrimonio.',
    run: async (client, message, args, prefix) => {
        const marriage = await Marriage.findOne({
            partnerId: message.author.id,
            status: 'proposed'
        });

        if (!marriage) {
            return message.reply('No tienes ninguna propuesta de matrimonio pendiente.');
        }

        await marriage.deleteOne();
        message.reply('Has rechazado la propuesta de matrimonio.');
    }
};





            
            
            
            



