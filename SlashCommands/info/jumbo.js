const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: 'jumbo',
    description: 'Obtener la imagen completa de un emoji.',
    options: [
        {
            name: 'emoji',
            description: 'El emoji a agrandar.',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
    ],

    run: async (client, interaction) => {
        try {
            let emoji = interaction.options.getString('emoji');
            let custom = parseCustomEmoji(emoji);

            if (!emoji) {
                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor('#fbd9ff')
                            .setAuthor({ name: 'Error Code: 3867' })
                            .setDescription(`No se ha proporcionado el emote.\n\nUso correcto del comando:\n\` /jumbo <emoji> \``)
                    ],
                    ephemeral: true
                });
            } else if (!custom.id) {
                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor('#fbd9ff')
                            .setAuthor({ name: 'Error Code: 4232' })
                            .setDescription(`El emote proporcionado no es un emote válido.\nEs posible que el emote proporcionado no esté en el servidor o sea un emote integrado de Discord.`)
                    ],
                    ephemeral: true
                });
            } else if (custom.id) {
                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor('#fbd9ff')
                            .setImage(`https://cdn.discordapp.com/emojis/${custom.id}.${custom.animated ? 'gif' : 'png'}`)
                    ]
                });
            }
        } catch (error) {
            console.error(`${error} || ${this.name} || ${interaction} || ${interaction.user} || ${interaction.guild.name}`);
        }
    }
};

function parseCustomEmoji(emoji) {
    const match = emoji.match(/^<:(\w+):(\d+)>$/) || emoji.match(/^<a:(\w+):(\d+)>$/);
    if (!match) return {};
    return { name: match[1], id: match[2], animated: emoji.startsWith('<a:') };
}
