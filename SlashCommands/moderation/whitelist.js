const { ApplicationCommandOptionType } = require('discord.js');
const Whitelist = require(`${process.cwd()}/schemas/whitelist.js`);

module.exports = {
    name: 'addwhitelist',
    description: 'Agrega un usuario a la lista blanca con permisos específicos.',
    options: [
        {
            name: 'usuario',
            type: ApplicationCommandOptionType.User,
            description: 'Usuario que será añadido a la lista blanca.',
            required: true,
        },
        {
            name: 'permiso',
            type: ApplicationCommandOptionType.String,
            description: 'Permiso que será otorgado al usuario.',
            required: true,
            choices: [
                { name: 'Eliminar canal', value: 'eliminarcanal' },
                { name: 'Añadir bot', value: 'addbot' },
                { name: 'Otros permisos', value: 'otros' },
            ],
        },
    ],
    async run(interaction) {
        const user = interaction.options.getUser('usuario');
        const permiso = interaction.options.getString('permiso');
        const guildId = interaction.guild.id;

        try {
            let whitelistEntry = await Whitelist.findOne({ guildId, userId: user.id });

            if (!whitelistEntry) {
                whitelistEntry = new Whitelist({ guildId, userId: user.id, permissions: [permiso] });
            } else if (!whitelistEntry.permissions.includes(permiso)) {
                whitelistEntry.permissions.push(permiso);
            } else {
                return interaction.reply({ content: `El usuario ya tiene el permiso **${permiso}** en la lista blanca.`, ephemeral: true });
            }

            await whitelistEntry.save();
            return interaction.reply({ content: `✅ **${user.tag}** ha sido añadido a la lista blanca con el permiso **${permiso}**.`, ephemeral: true });
        } catch (error) {
            console.error('Error al añadir a la lista blanca:', error);
            return interaction.reply({ content: '❌ Hubo un error al procesar la solicitud.', ephemeral: true });
        }
    },
};
