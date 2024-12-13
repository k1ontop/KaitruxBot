const { REST } = require('@discordjs/rest');
const { Routes } = require('discord.js');
const fs = require('fs');
require('dotenv').config();

const clientId = process.env.clientId; // Asegúrate de tener el clientId en tu archivo .env

const rest = new REST({ version: '10' }).setToken(process.env.clientToken);

// Lee todos los archivos de comandos en la carpeta SlashCommands
const commandFiles = fs.readdirSync('./SlashCommands').filter(file => file.endsWith('.js'));
const commands = [];

for (const file of commandFiles) {
    const command = require(`./SlashCommands/${file}`);
    if (command.data && command.data.toJSON) {
        commands.push(command.data.toJSON());
    }
}

(async () => {
    try {
        console.log('Registrando comandos desde archivos...');

        // Registrar los comandos globales
        await rest.put(Routes.applicationCommands(clientId), { body: commands });

        console.log('Comandos registrados con éxito.');
    } catch (error) {
        console.error(error);
    }
})();
