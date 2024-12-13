const { ApplicationCommandOptionType, PermissionsBitField, EmbedBuilder,ChannelType } = require('discord.js');
const Blacklist = require(`${process.cwd()}/schemas/blacklistword.js`);

module.exports = {
    name: 'bw',
    description: 'Gestiona la lista negra de palabras en el servidor.',
    options: [
        {
            name: 'action',
            description: 'Añadir, eliminar o listar palabras en la lista negra.',
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
                { name: 'Add', value: 'add' },
                { name: 'Remove', value: 'remove' },
                { name: 'List', value: 'list' },
            ],
        },
        {
            name: 'word',
            description: 'La palabra para añadir o eliminar.',
            type: ApplicationCommandOptionType.String,
            required: false,
        },
    ],
    run: async (client, interaction) => {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle('❌ Error')
                        .setDescription("No tienes permiso para usar este comando.")
                        .setColor('#FF0000')
                ],
                ephemeral: true
            });
        }

        const action = interaction.options.getString('action');
        const word = interaction.options.getString('word');

        let blacklistData = await Blacklist.findOne({ guildId: interaction.guild.id });
        if (!blacklistData) {
            blacklistData = new Blacklist({
                guildId: interaction.guild.id,
                words: [],
            });
        }

        if (action === 'add') {
            if (!word) return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle('❌ Error')
                        .setDescription("Proporcione una palabra para añadir a la lista negra.")
                        .setColor('#FF0000')
                ],
                ephemeral: true
            });
            if (blacklistData.words.includes(word.toLowerCase())) {
                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle('❌ Error')
                            .setDescription("Esta palabra ya está en la lista negra.")
                            .setColor('#FF0000')
                    ],
                    ephemeral: true
                });
            }
            blacklistData.words.push(word.toLowerCase());
            await blacklistData.save();
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle('✅ Éxito')
                        .setDescription(`La palabra \`${word}\` ha sido añadida a la lista negra.`)
                        .setColor('#00FF00')
                ],
                ephemeral: true
            });
        } else if (action === 'remove') {
            if (!word) return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle('❌ Error')
                        .setDescription("Proporcione una palabra para eliminar de la lista negra.")
                        .setColor('#FF0000')
                ],
                ephemeral: true
            });
            if (!blacklistData.words.includes(word.toLowerCase())) {
                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle('❌ Error')
                            .setDescription("Esta palabra no está en la lista negra.")
                            .setColor('#FF0000')
                    ],
                    ephemeral: true
                });
            }
            blacklistData.words = blacklistData.words.filter(w => w !== word.toLowerCase());
            await blacklistData.save();
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle('✅ Éxito')
                        .setDescription(`La palabra \`${word}\` ha sido eliminada de la lista negra.`)
                        .setColor('#00FF00')
                ],
                ephemeral: true
            });
        } else if (action === 'list') {
            const words = blacklistData.words;
            if (words.length === 0) {
                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle('ℹ️ Información')
                            .setDescription("La lista negra está actualmente vacía.")
                            .setColor('#00FFFF')
                    ],
                    ephemeral: true
                });
            }
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle('ℹ️ Información')
                        .setDescription(`Palabras en la lista negra: \`${words.join(', ')}\``)
                        .setColor('#00FFFF')
                ],
                ephemeral: true
            });
        }
    }
};
