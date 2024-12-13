const mongoose = require('mongoose');
const { Client, Collection, Partials, GatewayIntentBits, WebhookClient, EmbedBuilder, ChannelType } = require('discord.js');
const handler = require('./handler/index.js');
require('dotenv').config();
const { DisTube } = require('distube');
const LogSettings = require('./schemas/LogSettings'); // Importar el esquema de LogSettings
const client = new Client({
    allowedMentions: {
        parse: ['users', 'roles'],
        repliedUser: false
    },
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildModeration,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.MessageContent,
    ],
    partials: [
        Partials.Channel,
        Partials.Message,
        Partials.Reaction,
    ],
});

module.exports = client;

client.userDB = require('./schemas/User.js');
client.commands = new Collection();
client.slash = new Collection();
client.config = require('./config.json');

// Cargar manejadores
handler.loadEvents(client);
handler.loadCommands(client);
handler.loadSlashCommands(client);

// Webhook para logs de comandos
const webhookUrl = 'https://discord.com/api/webhooks/1052077591412088862/t-xRpi1SWrAtemSF5OJEYcVQW07ZVNBr5JE6K6DVgIEhUBTUoxB4z5CA3NkYvc70HWQB';
const webhookClient = new WebhookClient({ url: webhookUrl });
const disabledUsers = new Set();

// Manejo de interacciones
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const command = client.slash.get(interaction.commandName);
    if (!command) {
        return interaction.reply({ content: '❌¡Ha ocurrido un error al ejecutar el comando, reportar al dueño!❌', ephemeral: true });
    }

    try {
        await command.run(client, interaction, interaction.options._hoistedOptions);
    } catch (e) {
        console.error(e);
        interaction.reply({ content: '❌ Ha ocurrido un error al ejecutar el comando.', ephemeral: true });
    }
});


const cooldowns = new Map();

function checkCooldown(userId, commandName, cooldownTime) {
    const key = `${userId}-${commandName}`;
    const now = Date.now();
    if (cooldowns.has(key) && now < cooldowns.get(key)) {
        const remaining = Math.ceil((cooldowns.get(key) - now) / 1000);
        return { active: true, remaining };
    }
    cooldowns.set(key, now + cooldownTime);
    return { active: false };
}

// Configuración de DisTube (módulo de música)
client.distube = new DisTube(client);
require('./distubeEvents.js')(client);

client.logSettings = new Map();

// Conexión a MongoDB
client.once('ready', async () => {
    console.log('Bot is ready!');
    try {
        await mongoose.connect(process.env.mongodbToken, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('MongoDB conectado');
    } catch (err) {
        console.error('Error al conectar a MongoDB:', err);
    }

    const logSettings = await LogSettings.find();
    logSettings.forEach(setting => {
        client.logSettings.set(setting.guildId, setting.events);
        console.log('Eventos cargados correctamente');
    });
});

// Configuración inicial de nuevos servidores
client.on('guildCreate', guild => {
    client.logSettings.set(guild.id, {
        channelCreate: null,
        channelUpdate: null,
        guildBanAdd: null,
        guildMemberAdd: null,
        guildMemberRemove: null,
        messageDelete: null,
        presenceUpdate: null,
    });
});




// Iniciar sesión en Discord
client.login(process.env.clientToken);
console.log("smd, coded by cactus <3")

// MongoDB Connection
mongoose.connect(process.env.mongodbToken)
    .then(() => { console.log("MongoDB conectado"); 
        
    });