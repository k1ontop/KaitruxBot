const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const Antiraid = require(`${process.cwd()}/schemas/antiraid.js`);

module.exports = {
    name: 'activar-antiraid',
    description: 'Activa o desactiva el sistema antiraid en el servidor.',
   run: async (client, message, args) => {
        if (!message.member.permissions.has('Administrator')) {
            return message.channel.send('❌ No tienes permisos para usar este comando.');
        }

        const estado = args[0]?.toLowerCase();
        if (!estado || !['activar', 'desactivar'].includes(estado)) {
            return message.channel.send('❌ Uso incorrecto del comando. Usa `activar-antiraid activar` o `activar-antiraid desactivar`.');
        }

        const guildId = message.guild.id;
        let antiraid = await Antiraid.findOne({ guildId });

        if (!antiraid) {
            antiraid = new Antiraid({ guildId, active: estado === 'activar' });
        } else {
            antiraid.active = estado === 'activar';
        }

        await antiraid.save();

        if (estado === 'activar') {
            const warningEmbed = new EmbedBuilder()
                .setTitle('Advertencia de Jerarquía de Roles')
                .setDescription(
                    'Para que el sistema antiraid funcione correctamente, asegúrate de que mi rol **Kaitrux** esté primero en la jerarquía. ' +
                    'De lo contrario, no podré banear o gestionar usuarios con roles superiores al mío.'
                )
                .setColor('Yellow')
                .setFooter({ text: 'Configuración del sistema antiraid.' });

            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId('entendido')
                    .setLabel('Entendido')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setLabel('¿Qué es la jerarquía?')
                    .setStyle(ButtonStyle.Link)
                    .setURL('https://media.discordapp.net/attachments/1308121214493003878/1313856515333034014/2024-12-04_10-14-40.gif?ex=6751a7bb&is=6750563b&hm=284846e3fe5f2b3caeffd8b8511b0c540afa48bd5ff83be8646e1e8c0293d6da&=&width=1193&height=671')
            );

            const embedMessage = await message.channel.send({ embeds: [warningEmbed], components: [row] });

            const filter = (btnInteraction) => btnInteraction.user.id === message.author.id;
            const collector = embedMessage.createMessageComponentCollector({ filter, time: 60000 });

            collector.on('collect', async (btnInteraction) => {
                if (btnInteraction.customId === 'entendido') {
                    await btnInteraction.reply({ content: '✅ Entendido. El sistema antiraid ha sido activado.', ephemeral: true });
                }
            });

            collector.on('end', () => {
                embedMessage.edit({ components: [] }).catch(() => {});
            });
        } else {
            message.channel.send('✅ El sistema antiraid ha sido desactivado.');
        }
    }
};
