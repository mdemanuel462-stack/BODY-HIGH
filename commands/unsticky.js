const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const stickySystem = require('../handlers/sticky');

module.exports = {
    name: 'unsticky',

    async execute(message) {

        const sticky = stickySystem.data;
        const g = message.guild.id;
        const c = message.channel.id;

        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            return message.channel.send({
                embeds: [new EmbedBuilder().setColor('#EC1D1D').setDescription('❌ No tienes permisos.')]
            });
        }

        if (sticky[g]) delete sticky[g][c];

        stickySystem.save();

        message.channel.send({
            embeds: [new EmbedBuilder().setColor('#EC1D1D').setDescription('❌ Sticky eliminado')]
        });
    }
};
