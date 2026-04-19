const { EmbedBuilder } = require('discord.js');
const stickySystem = require('../handlers/sticky');

module.exports = {
    name: 'stickystats',

    async execute(message) {

        const sticky = stickySystem.data;
        const data = sticky[message.guild.id]?.[message.channel.id];

        if (!data || data.length === 0) {
            return message.channel.send({
                embeds: [new EmbedBuilder().setColor('#EC1D1D').setDescription('❌ No hay sticky en este canal')]
            });
        }

        let texto = '';

        data.forEach((s, i) => {
            texto += `**#${i + 1}**\n🧷 ${s.text}\n🔁 Usos: ${s.uses}\n\n`;
        });

        const embed = new EmbedBuilder()
            .setColor('#EC1D1D')
            .setTitle('📊 Sticky Stats')
            .setDescription(texto);

        message.channel.send({ embeds: [embed] });
    }
};
