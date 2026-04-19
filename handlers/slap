const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'slap',

    async execute(message, args) {

        const error = (txt) => {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor('#EC1D1D')
                        .setDescription(`❌ ${txt}`)
                ]
            });
        };

        const user = message.mentions.users.first();

        if (!user) {
            return error('Menciona a alguien.');
        }

        if (user.bot) {
            return error('No puedes usar esto con bots.');
        }

        if (user.id === message.author.id) {
            return error('No puedes golpearte a ti mismo.');
        }

        const gifs = [
            "https://media.tenor.com/4pN0j8gkJZcAAAAC/anime-slap.gif",
            "https://media.tenor.com/Ws6Dm1ZW_vMAAAAC/girl-slap.gif",
            "https://media.tenor.com/3uYgV7h8z9QAAAAC/slap-anime.gif"
        ];

        const randomGif = gifs[Math.floor(Math.random() * gifs.length)];

        const embed = new EmbedBuilder()
            .setColor('#EC1D1D')
            .setTitle('Bofetada en Body High')
            .setDescription(`${message.author} le dio una bofetada a ${user} 😈`)
            .setImage(randomGif)
            .setFooter({ text: '' })
            .setTimestamp();

        message.channel.send({ embeds: [embed] });

    }
};
