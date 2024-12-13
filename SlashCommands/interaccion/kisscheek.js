const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const client = require("aflb");
const aflb = new client();
const emojis = require(`${process.cwd()}/emojis.json`);

module.exports = {
    name: "kisscheek",
    description: "Dar un beso en la mejilla a un usuario",
    options: [
        {
            name: "usuario",
            description: "El usuario al que le quieres dar un beso en la mejilla",
            type: ApplicationCommandOptionType.User,
            required: true
        }
    ],
    run: async (client, interaction) => {
        const user = interaction.options.getUser("usuario");
        const author = await interaction.guild.members.fetch(interaction.user.id);
        const target = await interaction.guild.members.fetch(user.id);

        const dato = await aflb.sfw.kissCheek();
        
        const embed = new EmbedBuilder()
            .setDescription(`${author.displayName} le dio un beso en la mejilla a ${target.displayName}`)
            .setImage(dato)
            .setColor("#ff0000")
            .setFooter({ text: `${emojis.emojis.cute.name} Bot creado por k1 Con amor para ustedes` });

        await interaction.reply({ embeds: [embed] });
    }
};
