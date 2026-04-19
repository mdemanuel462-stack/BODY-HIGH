const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'kissglobal',

    async execute(message) {

        const embed = new EmbedBuilder()
            .setColor('#EC1D1D')
            .setTitle('Besos Globales')
            .setDescription(`Total de besos registrados: **${globalKisses}**`)
            .setFooter({ text: 'Body High observa cada beso...' })
            .setTimestamp();

        message.channel.send({ embeds: [embed] });

    }
};
