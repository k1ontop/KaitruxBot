const Blacklist = require(`${process.cwd()}/schemas/blacklistword.js`);

module.exports = {
    name: "bw",
    permissions: ["Administrator"],
    run: async (client, message, args) => {
        // Verificar si el usuario tiene permisos de administrador
        if (!message.member.permissions.has('Administrator')) {
            return message.reply("❌ You don't have permission to use this command.");
        }

        // Comprobar el argumento de acción
        const action = args[0];
        if (!["add", "remove", "list"].includes(action)) {
            return message.reply("❌ Invalid action. Use `add`, `remove`, or `list`.");
        }

        // Buscar o crear un documento de lista negra para el servidor
        let blacklistData = await Blacklist.findOne({ guildId: message.guild.id });
        if (!blacklistData) {
            blacklistData = new Blacklist({
                guildId: message.guild.id,
                words: [],
            });
        }

        if (action === "add") {
            const word = args[1];
            if (!word) return message.reply("❌ Please provide a word to add to the blacklist.");

            if (blacklistData.words.includes(word.toLowerCase())) {
                return message.reply("❌ This word is already in the blacklist.");
            }

            blacklistData.words.push(word.toLowerCase());
            await blacklistData.save();

            message.reply(`✅ The word \`${word}\` has been added to the blacklist.`);
        } else if (action === "remove") {
            const word = args[1];
            if (!word) return message.reply("❌ Please provide a word to remove from the blacklist.");

            if (!blacklistData.words.includes(word.toLowerCase())) {
                return message.reply("❌ This word is not in the blacklist.");
            }

            blacklistData.words = blacklistData.words.filter(w => w !== word.toLowerCase());
            await blacklistData.save();

            message.reply(`✅ The word \`${word}\` has been removed from the blacklist.`);
        } else if (action === "list") {
            const words = blacklistData.words;
            if (words.length === 0) return message.reply("ℹ️ The blacklist is currently empty.");

            message.reply(`🔒 Blacklisted words: \`${words.join(', ')}\``);
        }
    }
};
