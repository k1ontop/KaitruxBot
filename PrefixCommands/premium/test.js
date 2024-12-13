const User = require(`${process.cwd()}/schemas/uuser.js`); // Ruta del esquema de usuarios

module.exports = {
    name: 'testpremium',
    description: 'Verifica si eres un usuario premium.',
    run: async (client, message) => {
        const user = await User.findOne({ userId: message.author.id });

        if (user && user.isPremium) {
            return message.channel.send('Eres un usuario premium.');
        } else {
            return message.channel.send('No eres un usuario premium.');
        }
    }
};
