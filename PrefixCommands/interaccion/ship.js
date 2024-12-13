const lyricsfinder = require('lyrics-finder');
const { Discord, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'lyrics',
    description: 'Display lyrics of a song.',
    category: 'Music',
    
    run: async (distube, message, args) => {

        const song = args.join("  ");
        const queue = distube.getQueue(message);

        if (!queue) {
            return message.reply('There is nothing in the queue right now!');
        }

        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel || voiceChannel !== message.guild.members.me.voice.channel) {
            return message.reply('You need to be in the same voice channel!');
        }

        let csong = queue.songs[0];
        let searchSong = song || (csong ? csong.name : null);

        if (!searchSong) {
            return message.reply('Please provide a song name or play a song first.');
        }

        let lyrics = null;

        try {
            lyrics = await lyricsfinder(searchSong, '');
            if (!lyrics) {
                return message.reply("Couldn't find any lyrics for that song!");
            }
        } catch (err) {
            console.log(err);
            return message.reply("Couldn't find any lyrics for that song!");
        }

        let lyricsEmbed = new EmbedBuilder()
            .setColor('#FF0000')
            .setTitle(`Lyrics`)
            .setDescription(`**${searchSong}**\n${lyrics}`)
            .setFooter({ text: `Requested by ${message.author.username}` })
            .setTimestamp();

        if (lyrics.length > 2048) {
            lyricsEmbed.setDescription('Lyrics too long to display!');
        }

        const msg = await message.channel.send({ embeds: [lyricsEmbed] });

        var total = queue.songs[0].duration * 1000;
        var current = queue.currentTime * 1000;
        let time = total - current;
        setTimeout(() => { 
            msg.delete(); 
        }, time);
    },
};
