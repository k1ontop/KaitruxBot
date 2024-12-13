const { ApplicationCommandOptionType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const Marriage = require('../../schemas/marry.js');

module.exports = {
    name: 'marry',
    description: 'Propón matrimonio a otro usuario',
    options: [
        {
            name: 'user',
            description: 'El usuario al que quieres proponer matrimonio',
            type: ApplicationCommandOptionType.User,
            required: true
        }
    ],
    run: async (client, interaction) => {
        const proposedUser = interaction.options.getUser('user');

        if (proposedUser.id === interaction.user.id) {
            return interaction.reply({ content: 'No puedes proponerte matrimonio a ti mismo.', ephemeral: true });
        }

        const existingMarriage = await Marriage.findOne({ userId1: interaction.user.id, userId2: proposedUser.id })
            || await Marriage.findOne({ userId1: proposedUser.id, userId2: interaction.user.id });

        if (existingMarriage) {
            return interaction.reply({ content: 'Ya estás casado con este usuario.', ephemeral: true });
        }

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('accept')
                    .setLabel('Aceptar')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId('decline')
                    .setLabel('Rechazar')
                    .setStyle(ButtonStyle.Danger)
            );

        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Propuesta de Matrimonio')
            .setDescription(`${proposedUser}, ¿aceptas casarte con ${interaction.user}?`)
            .setFooter({ text: 'Propuesta de matrimonio' });

        await interaction.reply({ embeds: [embed], components: [row] });

        const filter = i => ['accept', 'decline'].includes(i.customId) && i.user.id === proposedUser.id;
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

        collector.on('collect', async i => {
            if (i.customId === 'accept') {
                const newMarriage = new Marriage({
                    userId1: interaction.user.id,
                    userId2: proposedUser.id
                });
                await newMarriage.save();

                await i.update({ content: '¡Felicidades! ¡Están casados!', components: [], embeds: [] });
            } else {
                await i.update({ content: 'La propuesta de matrimonio ha sido rechazada.', components: [], embeds: [] });
            }
        });

        collector.on('end', collected => {
            if (collected.size === 0) {
                interaction.editReply({ content: 'La propuesta de matrimonio ha expirado.', components: [], embeds: [] });
            }
        });
    }
};
