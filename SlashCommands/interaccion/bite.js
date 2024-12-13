const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const client = require("aflb");
const aflb = new client();
const emojis = require(`${process.cwd()}/emojis.json`);

module.exports = {
    name: "bite",
    description: "Morder a un usuario",
    options: [
        {
            name: "usuario",
            description: "El usuario al que quieres morder",
            type: ApplicationCommandOptionType.User,
            required: true
        }
    ],
    run: async (client, interaction) => {
        const user = interaction.options.getUser("usuario");
        const author = await interaction.guild.members.fetch(interaction.user.id);
        const target = await interaction.guild.members.fetch(user.id);

        const dato = await aflb.sfw.bite();
        
        const embed = new EmbedBuilder()
            .setDescription(`${author.displayName} mordió a ${target.displayName}..`)
            .setImage(dato)
            .setColor("#ff0000")
            .setFooter({ text: `${emojis.emojis.cute.name} Bot creado por k1 Con amor para ustedes` });

        await interaction.reply({ embeds: [embed] });
    }
};
