const { ChannelType, EmbedBuilder, Collection } = require('discord.js');
const path = require('path');
const Profile = require(`${process.cwd()}/schemas/profilexx.js`);
const BlockedUser = require(`${process.cwd()}/schemas/block.js`);
const Blacklist = require(`${process.cwd()}/schemas/blacklistword.js`);
const Level = require(`${process.cwd()}/schemas/level.js`);
const AutoResponse = require(`${process.cwd()}/schemas/autoResponse.js`);
const AFK = require(`${process.cwd()}/schemas/afk.js`);
const recentMessages = new Map();
const SuggestSettings = require(`${process.cwd()}/schemas/SuggestSettings.js`);
const PrefixSchema = require(`${process.cwd()}/schemas/prefix.js`);
const defaultPrefix = '!'; // Prefijo predeterminado
const config = require(`${process.cwd()}/emojis.json`);
const DisabledCommand = require(`${process.cwd()}/schemas/disableCommands.js`);
const { checkCooldown } = require(`${process.cwd()}/cooldownManager.js`);
module.exports = {
    name: 'messageCreate',
    /**
     * @param {Message} message 
     * @param {Client} client 
     */
    async execute(message, client) {
        if (message.author.bot || message.channel.type === ChannelType.DM) return;

        

        // Obtener prefijo dinámico desde la base de datos
        let prefix = defaultPrefix;
        const guildPrefix = await PrefixSchema.findOne({ guildId: message.guild.id });
        if (guildPrefix) prefix = guildPrefix.prefix;

        // Sistema de AFK - Quitar estado AFK cuando envía un mensaje
        const afkData = await AFK.findOne({ guildId: message.guild.id, userId: message.author.id });
        if (afkData) {
            const durationInSeconds = Math.round((Date.now() - afkData.timestamp) / 1000);
            let afkDuration;

            if (durationInSeconds < 60) {
                afkDuration = `${durationInSeconds} segundos`;
            } else if (durationInSeconds < 3600) {
                afkDuration = `${Math.floor(durationInSeconds / 60)} minutos`;
            } else if (durationInSeconds < 86400) {
                afkDuration = `${Math.floor(durationInSeconds / 3600)} horas`;
            } else if (durationInSeconds < 604800) {
                afkDuration = `${Math.floor(durationInSeconds / 86400)} días`;
            } else if (durationInSeconds < 2419200) {
                afkDuration = `${Math.floor(durationInSeconds / 604800)} semanas`;
            } else if (durationInSeconds < 29030400) {
                afkDuration = `${Math.floor(durationInSeconds / 2419200)} meses`;
            } else {
                afkDuration = `${Math.floor(durationInSeconds / 29030400)} años`;
            }

            await AFK.deleteOne({ guildId: message.guild.id, userId: message.author.id });
            const returnMessage = new EmbedBuilder()
                .setDescription(`${message.author}, te hemos quitado el estado AFK después de ${afkDuration}.`)
                .setColor('#00FF00');
            await message.channel.send({ embeds: [returnMessage] });
        }

        // Notificar menciones a usuarios AFK
        if (message.mentions.members.size > 0) {
            for (const [_, mentionedMember] of message.mentions.members) {
                const mentionedAfkData = await AFK.findOne({ guildId: message.guild.id, userId: mentionedMember.id });
                if (mentionedAfkData) {
                    const afkEmbed = new EmbedBuilder()
                        .setDescription(`⚠️ ${mentionedMember} está en estado AFK: "${mentionedAfkData.message}".`)
                        .setColor('#FFA500');
                    await message.reply({ embeds: [afkEmbed] });
                }
            }
        }

        // Bloquear usuarios
        const blockedEntry = await BlockedUser.findOne({ blockerId: message.author.id, blockedId: message.mentions.users.first()?.id });
        if (blockedEntry) {
            return message.reply('Este usuario te ha bloqueado y no puedes interactuar con él.');
        }

        // Sistema de lista negra
        const blacklistData = await Blacklist.findOne({ guildId: message.guild.id });
        if (blacklistData) {
            const blacklistedWords = blacklistData.words;
            const messageContent = message.content.toLowerCase();
            if (blacklistedWords.some(word => messageContent.includes(word.toLowerCase()))) {
                await message.delete();
                const msg = await message.channel.send(`${message.author}, ¡tu mensaje contiene una palabra prohibida!`);
                setTimeout(() => msg.delete(), 5000);
            }
        }

        // Sistema de respuestas automáticas
        const autoResponses = await AutoResponse.find({ guildId: message.guild.id });
        for (const response of autoResponses) {
            if (message.content.toLowerCase().includes(response.trigger.toLowerCase())) {
                const key = `${message.author.id}_${response.trigger}`;
                if (recentMessages.has(key)) return;

                await message.channel.send(response.response);
                recentMessages.set(key, true);
                setTimeout(() => {
                    recentMessages.delete(key);
                }, 60000);
                break;
            }
        }

        // Sistema de niveles
        let levelData = await Level.findOne({ guildId: message.guild.id, userId: message.author.id });
        if (!levelData) {
            levelData = new Level({ guildId: message.guild.id, userId: message.author.id });
        }

        const xpToAdd = Math.floor(Math.random() * 10) + 1;
        levelData.xp += xpToAdd;
        const xpToNextLevel = levelData.level * 100;
        if (levelData.xp >= xpToNextLevel) {
            levelData.level++;
            levelData.xp = 0;
            const levelUpMessage = new EmbedBuilder()
                .setDescription(`${message.author}, ¡has alcanzado el nivel ${levelData.level}!`)
                .setColor('#00FF00');
            await message.channel.send({ embeds: [levelUpMessage] });
        }
        await levelData.save();

        // Comandos del bot
        if (!message.content.toLowerCase().startsWith(prefix)) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const cmd = args.shift().toLowerCase();

        if (cmd.length === 0) return;

        let command = client.commands.get(cmd) || client.commands.find(c => c.aliases?.includes(cmd));
        if (!command) {
            try {
                const embed = new EmbedBuilder()
                    .setColor("Red")
                    .setTitle(`${client.user.username} Sistema de Prefijos ${client.config.arrowEmoji}`)
                    .setDescription(`El comando que intentaste no existe.\nUsa \`${prefix}ayuda\` para ver todos los comandos.`);

                return message.reply({ embeds: [embed], ephemeral: true });
            } catch (error) {
                console.error(`[PREFIX_ERROR] Error al enviar el embed de 'comando no encontrado'.`, error);
            }
        }

        if (command.args && !args.length) {
            return message.reply('No has proporcionado ningún argumento.');
        }
                    // Verificar el cooldown
const cooldownTime = checkCooldown(message.author.id, cmd);
    if (cooldownTime > 0) {
        return message.reply(
            `¡Espera ${cooldownTime / 1000} segundos antes de usar este comando de nuevo!`
        );
    }


        // Cargar blacklist desde un archivo JSON
        const blacklistPath = path.join(__dirname, '../../data/blacklist.json');
        delete require.cache[require.resolve(blacklistPath)];
        const { blacklist } = require(blacklistPath);
        if (blacklist.includes(message.author.id)) {
            return message.reply('No tienes permiso para usar comandos.');
        }

 // Comprobación de comandos deshabilitados
const isDisabled = await DisabledCommand.findOne({
    guildId: message.guild.id,
    $or: [
        { channelId: message.channel.id }, // Comando deshabilitado en el canal
        { channelId: null }, // Comando deshabilitado en todo el servidor
    ],
    command: cmd,
});

if (isDisabled) {
    return message.reply(`❌ El comando \`${cmd}\` está deshabilitado en este canal o servidor.`);
}

// Continuar con la ejecución del comando si no está deshabilitado
try {
    await command.run(client, message, args);
} catch (error) {
    console.error(`[${new Date().toLocaleString()}] [MESSAGE_CREATE] Error al ejecutar el comando.`, error);

    const embed = new EmbedBuilder()
        .setColor("Red")
        .setTitle("Vaya...")
        .setDescription(`Hubo un error al ejecutar este comando:\n\`${error}\`\nUsa \`/report\` para reportarlo.`);
    await message.reply({ embeds: [embed], ephemeral: true });
     }
    }
}