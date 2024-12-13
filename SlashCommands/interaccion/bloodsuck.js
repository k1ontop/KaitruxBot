const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const aflb = require("aflb");
const clientAflb = new aflb();
const emojis = require(`${process.cwd()}/emojis.json`);

module.exports = {
    name: "bloodsuck",
    description: "Chupa la sangre de un usuario",
    options: [
        {
            name: "user",
            description: "Elige al usuario",
            type: ApplicationCommandOptionType.User,
            required: true
        }
    ],
    run: async (client, interaction) => {
        const user = interaction.options.getMember("user");

        if (!user) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle('❌ Error')
                        .setDescription('Creo que quisiste usar ese comando con alguien más..')
                        .setFooter({ text: 'Error código: #100' })
                        .setColor('#FF0000')
                ],
                ephemeral: true
            });
        }

        const author = interaction.member;

        const myNekoFunction = async () => {
            let dato = await clientAflb.sfw.bloodsuck();
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(`${author.displayName} chupa la sangre de: ${user.displayName}... asco...`)
                        .setImage(dato)
                        .setColor("#ff0000")
                        .setFooter({ text: `${emojis.emojis.cute.name} Bot creado por k1 con amor para ustedes` })
                ]
            });
        };

        myNekoFunction();
    }
};
