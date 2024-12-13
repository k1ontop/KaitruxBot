const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");
const client = require("aflb");
const aflb = new client();
const kissSchema = require(`${process.cwd()}/schemas/besos.js`);
const config = require(`${process.cwd()}/emojis.json`);

module.exports = {
    name: "kiss",
    description: "Besa a alguien.",
    options: [
        {
            name: "user",
            description: "El usuario al que quieres besar",
            type: ApplicationCommandOptionType.User,
            required: true
        },
        {
            name: "ephemeral",
            description: "Mostrar el mensaje solo a ti",
            type: ApplicationCommandOptionType.Boolean,
            required: false
        }
    ],
    run: async (client, interaction) => {
        const target = interaction.options.getMember("user");
        const hideOrNot = interaction.options.getBoolean("ephemeral") || false;
        const author = interaction.member;

        if (!target) {
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

        // Buscar en la base de datos y actualizar el conteo de besos
        let data = await kissSchema.findOneAndUpdate({
            $or: [
                { user1: author.id, user2: target.id },
                { user1: target.id, user2: author.id }
            ],
        }, {
            $inc: {
                count: 1
            }
        });

        if (!data) {
            data = await kissSchema.create({
                user1: author.id,
                user2: target.id,
                count: 1
            });

            await data.save();
        }

        // Obtener y enviar el GIF
        const myNekoFunction = async () => {
            try {
                let gifData = await aflb.sfw.kiss();
                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setDescription(`**${author.displayName}** le dio un beso a **${target.displayName}**.\n***${author.displayName}** y **${target.displayName}** se han besado ${data.count} veces ${data.count > 1}.*`)
                            .setImage(gifData)
                            .setColor("#060606")
                    ],
                    ephemeral: hideOrNot
                });
            } catch (error) {
                console.error(error);
                return interaction.reply({
                    content: "Hubo un error al intentar obtener la imagen.",
                    ephemeral: true
                });
            }
        };

        myNekoFunction();
    }
};
