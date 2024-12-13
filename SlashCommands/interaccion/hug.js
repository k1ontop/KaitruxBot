const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const client = require('aflb');
const aflb = new client();
const hugSchema = require("../../schemas/hug.js");
const emojis = require(`${process.cwd()}/emojis.json`);
const fs = require("fs");
const path = require("path");
const blacklistPath = path.join('./data/blocklist.json');

module.exports = {
    name: "hug",
    description: "Abraza a alguien.",
    options: [
        {
            name: "usuario",
            description: "El usuario al que quieres abrazar",
            type: ApplicationCommandOptionType.User,
            required: true
        }
    ],
    run: async (client, interaction) => {
        const mention = await interaction.guild.members.fetch(interaction.options.getUser("usuario").id);
        if (!mention) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle('❌ Error')
                        .setDescription('Creo que quisiste usar ese comando con alguien más...')
                        .setFooter({ text: 'Error código: #100' })
                        .setColor('#FF0000')
                ],
                ephemeral: true
            });
        }

        // Leer la lista de bloqueos
        let blacklist = JSON.parse(fs.readFileSync(blacklistPath, "utf-8"));

        // Verificar si el objetivo ha bloqueado al autor del comando
        const isBlocked = blacklist.blockedInteractions.some(
            (entry) => entry.blockedBy === mention.id && entry.blockedUser === interaction.user.id
        );

        if (isBlocked) {
            return interaction.reply(`No puedes interactuar con ${mention.user.username} porque te ha bloqueado.`);
        }

        const author = await interaction.guild.members.fetch(interaction.user.id);

        let data = await hugSchema.findOneAndUpdate({
            $or: [
                { user1: interaction.user.id, user2: mention.id },
                { user1: mention.id, user2: interaction.user.id }
            ]
        }, {
            $inc: {
                count: 1
            }
        }, { new: true }); // Devuelve el documento actualizado

        if (!data) {
            data = await hugSchema.create({
                user1: interaction.user.id,
                user2: mention.id,
                count: 1
            });

            let gifData = await aflb.sfw.hug();
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(`**${emojis.emojis.cute.name} ${author.displayName}** le dio un abrazo a **${mention.user.username}**.\n***${author.displayName}** y **${mention.user.username}** se han abrazado 1 vez.*`)
                        .setImage(gifData)
                        .setColor("#060606")
                ]
            });
        } else {
            let gifData = await aflb.sfw.hug();
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(`**${author.displayName}** le dio un abrazo a **${mention.user.username}**.\n***${author.displayName}** y **${mention.user.username}** se han abrazado ${data.count} veces.*`)
                        .setImage(gifData)
                        .setColor("#060606")
                ]
            });
        }
    }
};
