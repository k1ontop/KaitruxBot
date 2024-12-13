const { ApplicationCommandOptionType } = require("discord.js")

module.exports = {
    name: "test",
    description: "example command",
    ownerOnly: true,
    options: [
        {
            name: "ephemeral",
            description: "??",
            type: ApplicationCommandOptionType.Boolean,
            required: true
        }
    ],
    run: async(client, interaction) => {

        let hideOrNot = interaction.options.getBoolean("ephemeral");

        interaction.reply({
            content: `Este es un comando privado.`,
            ephemeral: hideOrNot
        })

    }
}