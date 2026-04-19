const { parseMessage } = require('../systems/embedbuilder.js');

module.exports = {
    name: 'embed',

    async execute(message, args) {

        const error = (txt) => {
            return message.channel.send({
                embeds: [
                    new (require('discord.js').EmbedBuilder)()
                        .setColor('#EC1D1D')
                        .setDescription(`❌ ${txt}`)
                ]
            });
        };

        const full = args.join(' ').trim();

        if (!full) return error('Escribe algo.');

        const parts = full.split('|');

        const contentText = parts[0]?.trim();
        const embedData = parts.slice(1).join('|').trim();

        try {

            const embed = parseMessage({
                description: embedData || '‎'
            });

            await message.channel.send({
                content: contentText || null,
                embeds: [embed]
            });

        } catch (err) {
            console.error(err);
            return error('Error al crear el embed.');
        }

    }
};
