const fs = require("node:fs");
const chalk = require("chalk");
   const axios = require('axios');

// cargar Eventos
const loadEvents = async function (client) {
    const eventFolders = fs.readdirSync("./events");
    for (const folder of eventFolders) {
        const eventFiles = fs
        .readdirSync(`./events/${folder}`)
        .filter((file) => file.endsWith(".js"));
        
        for (const file of eventFiles) {
            const event = require(`../events/${folder}/${file}`);
            
            if (event.name) {
                console.log("EVENT: Sucess! --- " + file + " loaded");
            } else {
                console.log(chalk.gray(`${new Date().toLocaleString()}`), chalk.red("error de evento"), chalk.whiteBright(`--- Error al cargar el evento: ${file}`));
                continue;
            }
            
            if (event.once) {
                client.once(event.name, (...args) => event.execute(...args, client));
            } else {
                client.on(event.name, (...args) => event.execute(...args, client));
            }
        }
    }
}

// cargar los comandos 
const loadCommands = async function (client) {
    const commandFolders = fs.readdirSync("./PrefixCommands");
    for (const folder of commandFolders) {
        const commandFiles = fs
        .readdirSync(`./PrefixCommands/${folder}`)
        .filter((file) => file.endsWith(".js"));
        
        for (const file of commandFiles) {
            const command = require(`../PrefixCommands/${folder}/${file}`);
            
            if (command.name) {
                client.commands.set(command.name, command);
                console.log("PREFIX COMMAND: Sucess! ---" + file + " loaded");
            } else {
                console.log(chalk.gray(`${new Date().toLocaleString()}`), chalk.red("Error en un comando de prefix"), chalk.whiteBright(`--- Error cargando el archivo: ${file}`));
                continue;
            }
            
            if (command.aliases && Array.isArray(command))
            command.aliases.forEach((alias) => client.aliases.set(alias, command.name));
        }
    }
}


const loadSlashCommands = async function (client) {
    const slashCommands = [];
    const commandFolders = fs.readdirSync('./SlashCommands');

    for (const folder of commandFolders) {
        const commandFiles = fs.readdirSync(`./SlashCommands/${folder}`).filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
            const command = require(`../SlashCommands/${folder}/${file}`);

            if (command.name && command.description && typeof command.run === 'function') {
                client.slash.set(command.name, command); // Agregar comando a la colección
                slashCommands.push({
                    name: command.name,
                    description: command.description,
                    options: command.options || [] // Si no hay opciones, define un arreglo vacío
                });
                console.log(`SLASH COMMAND: Sucess! --- ${file} loaded`);
            } else {
                console.log(`SLASH COMMAND: Skipped --- ${file} (Formato inválido)`);
            }
        }
    }

    client.on('ready', async () => {
        try {
            console.log('Registrando comandos globales...');
            await client.application.commands.set(slashCommands); // Registrar comandos globales
            console.log('Comandos registrados con éxito.');
        } catch (error) {
            console.error('Error al registrar comandos:', error);
        }
    });
};
module.exports = {
    loadEvents,
    loadCommands,
    loadSlashCommands
}