const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js");
const config = require(`${process.cwd()}/emojis.json`);

module.exports = {
    name: "help",
    description: "¿Necesitas ayuda?",
    run: async (client, interaction) => {
        const embed = new EmbedBuilder()
            .setTitle("**¿Necesitas más ayuda?**")
            .setURL(`https://discord.gg/TRKtNU35`)
            .setDescription(`
                Kaitrux, un proyecto solitario creado por YungK1 con amor para quienes lo quieran usar y para quienes no, que se vayan a llorar con nekotina :p
            `)
            .setFooter({ text: ` Creado con amor por k1` })
            .setColor("#060606");

            const row = new ActionRowBuilder()
            .addComponents(
              new StringSelectMenuBuilder()
                .setCustomId(`help`)
                .setPlaceholder(`Nothing selected`)
                .addOptions([
                  {
                    label: `Reaccion`,
                    description: `Muestra los comandos de reaccion`,
                    value: `reaccion`,
                    emoji: config.emojis.lamer.name, // Emoji personalizado

                  },
                  {
                    label: `Accion`,
                    description: `Muestra todos los comandos de accion`,
                    value: `acc`,
                    emoji: config.emojis.lamer.name, // Emoji personalizado

      
                  },
                  {
                    label: `interaccion`,
                    description: `¡Mira las interacciones que tengo preparado para ti para que interactues con otro usuario!`,
                    value: `int`,
                    emoji: config.emojis.lamer.name, // Emoji personalizado

      
                  },
                  {
                    label: `moderacion`,
                    description: `Muestra los comandos de moderacion`,
                    value: `fun`,
                    emoji: config.emojis.lamer.name, // Emoji personalizado

                  },
                  {
                      label: `juegos`,
                      description: `Muestra los diferentes comandos de minijuegos que tengo para ti o tus`,
                      value: `jue`,
                      emoji: config.emojis.lamer.name, // Emoji personalizado

                    },
                    {
                      label: `misc`,
                      description: `Diferentes comandos mixto porque ya no quiero seguir haciendo`,
                      value: `misc`,
                      emoji: config.emojis.lamer.name, // Emoji personalizado

                    },
                  {
                    label: `contact`,
                    description: `Algun error? mira las posibles soluciones`,
                    value: `cont`,
                    emoji: config.emojis.lamer.name, // Emoji personalizado

                  },
                  {
                    label: `perfil`,
                    description: `Ve tu perfil personalizado del bot`,
                    value: `per`,
                    emoji: config.emojis.lamer.name, // Emoji personalizado

                  },
                  {
                    label: `Ayuda`,
                    description: `Aqui encontraras comandos de informacion/soporte para el bot`,
                    value: `ayu`,
                    emoji: config.emojis.lamer.name, // Emoji personalizado

                  },
                ]),
            );

        await interaction.reply({ embeds: [embed], components: [row] });

        // Verificamos si ya hay un listener para evitar duplicados
        if (!client.listenerRegistered) {
            client.listenerRegistered = true; // Marcamos que el listener ha sido registrado

            client.on('interactionCreate', async (interaction) => {
                if (!interaction.isStringSelectMenu() || interaction.customId !== 'help') return;

                let embedResponse;
                switch (interaction.values[0]) {
                    case "reaccion":
                        embedResponse = new EmbedBuilder()
                            .setTitle(`**Comandos de Reacción**`)
                            .addFields(
                                { name: `Angry`, value: `Enojado/a`, inline: false },
                                { name: `blush`, value: `Te sonrojaste?`, inline: false },
                                { name: `bored`, value: `ABURRIMIENTO`, inline: false },
                                { name: `cringe`, value: `Pena ajena..`, inline: false },
                                { name: `cry`, value: `Lloro :(`, inline: false },
                                { name: `happy`, value: `Felicidad <3`, inline: false },
                                { name: `panic`, value: `PANICOOO`, inline: false },
                                { name: `love`, value: `Se enamoró`, inline: false },
                                { name: `scared`, value: `Asustado??`, inline: false }
                            )
                            .setFooter({ text: `Creado con amor por k1` })
                            .setColor("#060606");
                        break;

                    case "acc":
                        embedResponse = new EmbedBuilder()
                            .setTitle("**Comandos de Acción**")
                            .addFields(
                                { name: `drink`, value: `Comando para alcohólicos`, inline: false },
                                { name: `facedesk`, value: `Recuéstate por tu escritorio`, inline: false },
                                { name: `cooking`, value: `Cocina algo delicioso`, inline: false },
                                { name: `sing`, value: `Canta a todo pulmón`, inline: false },
                                { name: `sipcoffee`, value: `Toma café`, inline: false },
                                { name: `sipjuice`, value: `Toma jugo`, inline: false },
                                { name: `smile`, value: `Sonríe :)`, inline: false },
                                { name: `smoke`, value: `Fumador..`, inline: false },
                            )
                            .setFooter({ text: `Creado con amor por k1` })
                            .setColor("#060606");
                        break;

                    case "int":
                        embedResponse = new EmbedBuilder()
                            .setTitle("**Comandos de Interacción**")
                            .addFields(
                                { name: `kiss`, value: `Besito`, inline: false },
                                { name: `bloodsuck`, value: `No diré nada de este comando`, inline: false },
                                { name: `fight`, value: `Pelea pelea pelea`, inline: false },
                                { name: `hug`, value: `Abrazo..`, inline: false },
                                { name: `bite`, value: `Muerde`, inline: false },
                                { name: `kisscheek`, value: `Besito en la mejilla`, inline: false }
                            )
                            .setFooter({ text: `Creado con amor por k1` })
                            .setColor("#060606");
                        break;
                        case "jue":
                            embedResponse = new EmbedBuilder()
                                .setTitle("**Comandos de juegos**🎮")
                                .addFields(
                                    { name: `tictactoe`, value: `El tipico juego 3 en raya en discord!`, inline: false },
                                    { name: `snake`, value: `El tipico juego de la serpiente en discord!`, inline: false },
                                    { name: `trivia`, value: `veamos que tanto sabes de videojuegos`, inline: false },
                                    { name: `8ball`, value: `veamos que tal tu suerte con una pregunta`,  inline:false}
                                )
                                .setFooter({ text: `Creado con amor por k1` })
                                .setColor("#060606");
                            break;
    
                    case "fun":
                        embedResponse = new EmbedBuilder()
                            .setTitle("**Comandos de Moderación**")
                            .addFields(
                                { name: `Ban/unban`, value: `Úsala para banear usuarios peligrosos`, inline: false },
                                { name: `Kick`, value: `Expulsa al usuario del servidor`, inline: false },
                                { name: `Mute/unmute`, value: `Silencia al usuario`, inline: false },
                                { name: `Warn/unwarn`, value: `Advierte al usuario en el servidor`, inline: false },
                                { name: `bw`, value: `Añade una palabra en la lista negra`, inline: false },
                                { name: `findban`, value: `Encuentra un baneo`, inline: false },
                                { name: `purge`, value: `Elimina una cierta cantidad de mensajes`, inline: false },
                                { name: `logs`, value: `activa el sistema de registro`, inline: false },


                            )
                            .setFooter({ text: "Creado con amor por k1" })
                            .setColor("#060606");
                        break;

                    case "misc":
                        embedResponse = new EmbedBuilder()
                            .setTitle("**Comandos de Misceláneo**")
                            .addFields(
                                { name: `serverinfo`, value: `Toda la información de un servidor`, inline: false },
                                { name: `userinfo`, value: `Toda la información de un usuario`, inline: false },
                                { name: `avatar`, value: `Ve la foto de perfil de un usuario`, inline: false },
                                { name: `help`, value: `Ya estás aquí, ¿no?`, inline: false },
                                { name: `report`, value: `Realiza un reporte directo al desarrollador`, inline: false },
                                { name: `findreport`, value: `Busca un reporte`, inline: false },
                                { name: `jumbo`, value: `Ve en pantalla completa un emoji`, inline: false },
                                { name: `botinfo`, value: `ve mi innecesaria informacion`, inline: false },


                            )
                            .setFooter({ text: "Creado con amor por k1" })
                            .setColor("#060606");
                        break;

                    case "per":
                        embedResponse = new EmbedBuilder()
                            .setTitle("**Comandos de Información**")
                            .addFields(
                                { name: `profile`, value: `Muestra tu perfil del servidor`, inline: false },
                                { name: `marry`, value: `Casate con alguien`, inline: false },
                                { name: `divorce`, value: `Divorciate de tu pareja`, inline: false },
                            )
                            .setFooter({ text: `Creado con amor por k1` })
                            .setColor("#060606");
                        break;
                        
                           case "ayu":
                        embedResponse = new EmbedBuilder()
                            .setTitle("**Comandos de Información**")
                            .addFields(
                                { name: `policyprivate`, value: `Lee nuestra política de privacidad`, inline: false },
                                { name: `tos`, value: `Lee los Términos de Servicio (Terms of Service)`, inline: false },
                                { name: `servidor`, value: `Servidor de soporte`, inline: false },
                            )
                            .setFooter({ text: `Creado con amor por k1` })
                            .setColor("#060606");
                        break;	

                    default:
                        return;
                }

                await interaction.reply({ embeds: [embedResponse], components: [], ephemeral: true });
            });
        }
    },
};
