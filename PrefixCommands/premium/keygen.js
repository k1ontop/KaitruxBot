const User = require(`${process.cwd()}/schemas/uuser.js`); // Ruta del esquema de usuarios
const PremiumKey = require(`${process.cwd()}/schemas/PremiumKeys.js`); // Ruta del esquema de claves premium
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'premium',
    description: 'Activa la membresía premium usando una clave.',
    run: async (client, message, args) => {
        const keyProvided = args[0]; // La clave proporcionada por el usuario

        if (!keyProvided) {
            return message.channel.send('Por favor, proporciona una clave premium.');
        }

        try {
            // Buscar la clave en la base de datos
            const premiumKey = await PremiumKey.findOne({ key: keyProvided });

            if (!premiumKey) {
                return message.channel.send('Clave premium no válida.');
            }

            if (premiumKey.isUsed) {
                return message.channel.send('Esta clave ya ha sido utilizada.');
            }

            // Actualizar el estado del usuario para premium
            const user = await User.findOne({ userId: message.author.id });
            if (!user) {
                return message.channel.send('Usuario no encontrado.');
            }

            user.isPremium = true;
            user.premiumActivatedAt = new Date();
            await user.save();

            // Marcar la clave como usada
            premiumKey.isUsed = true;
            premiumKey.usedBy = message.author.id;
            await premiumKey.save();

            const embed = new EmbedBuilder()
                .setColor('Green')
                .setTitle('¡Felicitaciones!')
                .setDescription(`Has activado tu suscripción premium con éxito.`)
                .setFooter({ text: 'Bienvenido a Premium!' });

            return message.channel.send({ embeds: [embed] });

        } catch (error) {
            console.error(error);
            return message.channel.send('Hubo un error al activar tu clave premium.');
        }
    }
};
