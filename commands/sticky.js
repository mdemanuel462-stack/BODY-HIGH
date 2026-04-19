const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const stickySystem = require('../handlers/sticky');

module.exports = {
    name: 'sticky',

    async execute(message, args) {

        const error = (txt) => {
            return message.channel.send({
                embeds: [new EmbedBuilder().setColor('#EC1D1D').setDescription(`❌ ${txt}`)]
            });
        };

        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            return error('No tienes permisos.');
        }

        const text = args.join(' ').trim();
        if (!text) return error('Escribe un mensaje.');

        const sticky = stickySystem.data;

        const g = message.guild.id;
        const c = message.channel.id;

        if (!sticky[g]) sticky[g] = {};
        if (!sticky[g][c]) sticky[g][c] = [];

        sticky[g][c].push({
            text,
            lastId: null,
            uses: 0
        });

        stickySystem.save();

        message.channel.send({
            embeds: [new EmbedBuilder().setColor('#EC1D1D').setDescription('🧷 Sticky activado')]
        });
    }
};
