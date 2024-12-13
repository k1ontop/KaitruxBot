const canvafy = require('canvafy');

module.exports = { 
    name: "ship",
    description: "www",
    run: async(client, message, args) => { 
        let member = message.mentions.members.first();
        if (!member) { 
            return message.reply({ content: "Please tag someone." });
        } else if (member.id === message.author.id) {   
            return message.reply({ content: "Please mention someone else." });
        }

        try {
            const love = await new canvafy.ship()
                .setAvatars(
                    message.author.displayAvatarURL({ forceStatic: true, extension: 'png' }),
                    member.user.displayAvatarURL({ forceStatic: true, extension: 'png' })
                )
                .setBackground(
                    "image",
                    "https://imgs.search.brave.com/OnfVttwSd9X8FLlat7zGztAdD4-EC75yJlIOcuxp8QI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/d2FsbHBhcGVyc2Fm/YXJpLmNvbS81MC81/NS94ak5ocFYuanBn"
                )
                .setBorder("f0f0f0")
                .setOverlayOpacity(0.5)
                .build();

            message.reply({
                files: [
                    {
                        attachment: love,
                        name: `ship-${message.member.id}.png`
                    }
                ]
            });
        } catch (error) {
            console.error(error);
            message.reply({ content: "There was an error creating the image. Please try again later." });
        }
    }
};
