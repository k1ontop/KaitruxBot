const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const AFK = require(`${process.cwd()}/schemas/afk.js`);

module.exports = {
    name: 'afk',
    description: 'Establece un mensaje de AFK',
    options: [
        {
            name: 'message',
            description: 'El mensaje de AFK',
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ],
    run: async (client, interaction) => {
        const afkMessage = interaction.options.getString('message');

        const existingAFK = await AFK.findOne({ guildId: interaction.guild.id, userId: interaction.user.id });
        if (existingAFK) {
            existingAFK.message = afkMessage;
            existingAFK.timestamp = Date.now();
            await existingAFK.save();
        } else {
            const newAFK = new AFK({
                guildId: interaction.guild.id,
                userId: interaction.user.id,
                message: afkMessage
            });
            await newAFK.save();
        }

        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('AFK Activado')
            .setDescription(`Estableciste tu estado AFK con el mensaje: "${afkMessage}"`)
            .setFooter({ text: 'Sistema AFK' });

        interaction.reply({ embeds: [embed], ephemeral: true });
    }
};
