const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'embed',

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

        const full = args.join(' ').trim();

        if (!full) {
            return error('Escribe algo.');
        }

        const parts = full.split('|');
        const contentText = parts[0]?.trim();
        const embedText = parts.slice(1).join('|').trim();

        try {
            const parsed = parseMessage(embedText);

            const embeds = parsed.embeds || [];
            const components = parsed.components || [];

            if (!embeds.length && !components.length) {
                return error('Mensaje vacío.');
            }

            await message.channel.send({
                content: contentText || null,
                embeds,
                components
            });

        } catch (err) {
            console.error(err);
            return error('Error al crear el embed.');
        }

    }
};

function parseMessage(text) {
    try {
        return {
            embeds: [
                new EmbedBuilder()
                    .setColor('#EC1D1D')
                    .setDescription(text?.trim() || '‎')
            ],
            components: []
        };
    } catch (err) {
        console.error('Error en parseMessage:', err);
        return {
            embeds: [],
            components: []
        };
    }
}
