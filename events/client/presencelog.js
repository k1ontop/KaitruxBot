const OnlineNotification = require(`${process.cwd()}/schemas/OnlineNotification.js`);

module.exports = {
    name: 'presencelog',
    run: async (client, oldPresence, newPresence) => {
        if (!newPresence || !newPresence.user || !newPresence.status) {
            return; // Salir si no hay nueva presencia, usuario o estado
        }

        const userId = newPresence.user.id;

        // Verificar si el usuario está en línea
        if (newPresence.status === 'online' && (!oldPresence || oldPresence.status !== 'online')) {
            const notifications = await OnlineNotification.find({ targetUserId: userId });

            notifications.forEach(async (notification) => {
                const user = await client.users.fetch(notification.userId);
                try {
                    await user.send(`${newPresence.user.username} se ha conectado.`);
                } catch (error) {
                    console.error(`No se pudo enviar la notificación a ${user.tag}.`);
                }
            });
        }
    },
};
