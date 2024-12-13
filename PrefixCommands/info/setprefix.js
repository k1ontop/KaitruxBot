const GuildPrefix = require('../../schemas/prefixSchema.js');

module.exports = {
    name: 'setprefix',
    aliases: ['prefix'],
    ownerOnly: false,
    adminOnly: true,
    run: async (client, message, args) => {
        // Verifica si el usuario tiene permisos de administrador
        if (!message.member.permissions.has('Administrator')) {
            return message.reply('Necesitas permisos de administrador para cambiar el prefijo.');
        }

        // Verifica si se proporcionó un prefijo
        const newPrefix = args[0];
        if (!newPrefix) {
            return message.reply('Por favor, proporciona un prefijo nuevo.');
        }

        // Actualiza o crea un nuevo prefijo en la base de datos para este servidor
        let guildPrefix = await GuildPrefix.findOne({ guildId: message.guild.id });

        if (guildPrefix) {
            guildPrefix.prefix = newPrefix;
            await guildPrefix.save();
        } else {
            guildPrefix = new GuildPrefix({
                guildId: message.guild.id,
                prefix: newPrefix
            });
            await guildPrefix.save();
        }

        message.reply(`El prefijo ha sido cambiado a \`${newPrefix}\``);
    }
}
