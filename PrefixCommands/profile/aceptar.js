const Profile = require(`${process.cwd()}/schemas/marry.js`);
module.exports = {
    name: 'aceptarpropuesta',
    description: 'Aceptar una propuesta de matrimonio.',
    run: async (client, message, args, prefix) => {
        const marriage = await Marriage.findOne({
            partnerId: message.author.id,
            status: 'proposed'
        });

        if (!marriage) {
            return message.reply('No tienes ninguna propuesta de matrimonio pendiente.');
        }

        marriage.status = 'married';
        await marriage.save();
        message.reply(`¡Felicidades! Ahora estás casado/a con <@${marriage.proposerId}>.`);
    }
};