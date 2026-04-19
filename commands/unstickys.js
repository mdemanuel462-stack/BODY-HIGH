const { EmbedBuilder } = require('discord.js');
const stickySystem = require('../handlers/sticky');

module.exports = {
    name: 'unstickys',

    async execute(message, args) {

        const sticky = stickySystem.data;
        const g = message.guild.id;
        const c = message.channel.id;

        const index = parseInt(args[0]) - 1;
        const data = sticky[g]?.[c];

        if (!data || !data[index]) {
            return message.channel.send({
                embeds: [new EmbedBuilder().setColor('#EC1D1D').setDescription('❌ Número inválido')]
            });
        }

        data.splice(index, 1);
        stickySystem.save();

        message.channel.send({
            embeds: [new EmbedBuilder().setColor('#EC1D1D').setDescription('🗑️ Sticky eliminado')]
        });
    }
};
