const { EmbedBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
    name: 'saveembed',

    async execute(message, args) {
u
        const error = (txt) => {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor('#EC1D1D')
                        .setDescription(`❌ ${txt}`)
                ]
            });
        };

        const raw = args.join(' ').trim();
        const parts = raw.split('|');

        const name = parts[0]?.trim();
        const content = parts.slice(1).join('|').trim();

        if (!name || !content) {
            return error('Usa: !saveembed nombre | embed');
        }

        let data = {};

        if (fs.existsSync('./embeds.json')) {
            try {
                data = JSON.parse(fs.readFileSync('./embeds.json', 'utf8'));
            } catch {
                data = {};
            }
        }

        data[name] = content;

        fs.writeFileSync('./embeds.json', JSON.stringify(data, null, 2));

        const embed = new EmbedBuilder()
            .setColor('#EC1D1D')
            .setTitle('💾 Embed guardado')
            .setDescription(`Guardado como **${name}**`)
            .setFooter({ text: '' })
            .setTimestamp();

        message.channel.send({ embeds: [embed] });

    }
};
