const { REST, Routes } = require('discord.js');
require('dotenv').config();

const commands = async () => {
    const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);

    try {
        console.log('Obteniendo todos los comandos de aplicación registrados...');
        const registeredCommands = await rest.get(
            Routes.applicationCommands(process.env.CLIENT_ID)
        );

        console.log('Comandos registrados:', registeredCommands);

        // Suponiendo que conoces el ID del comando que deseas eliminar
        const commandIdToDelete = '1301544496294789221'; // Reemplaza esto con el ID del comando que deseas eliminar

        await rest.delete(
            Routes.applicationCommand(process.env.CLIENT_ID, commandIdToDelete)
        );

        console.log(`Comando con ID ${commandIdToDelete} eliminado.`);
    } catch (error) {
        console.error(error);
    }
};

commands();
