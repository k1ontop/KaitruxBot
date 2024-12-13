const Marriage = require(`${process.cwd()}/schemas/marry.js`);
module.exports = {
    name: 'divorce',
    description: 'Divorciarse de tu pareja actual.',
    run: async (client, message, args, prefix) => {
        const marriage = await Marriage.findOne({
            $or: [
                { proposerId: message.author.id, status: 'married' },
                { partnerId: message.author.id, status: 'married' }
            ]
        });

        if (!marriage) {
            return message.reply('No estás casado/a con nadie.');
        }

        await marriage.deleteOne();
        message.reply('Te has divorciado exitosamente.');
    }
};