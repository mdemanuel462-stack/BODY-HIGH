const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const stickSystem = require('../handlers/stick'); // 👈 cambia si renombraste el archivo

module.exports = {
    name: 'stick',

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

        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            return error('No tienes permisos.');
        }

        const text = args.join(' ').trim();
        if (!text) return error('Escribe un mensaje.');

        const stick = stickSystem.data;

        const g = message.guild.id;
        const c = message.channel.id;

        if (!stick[g]) stick[g] = {};
        if (!stick[g][c]) stick[g][c] = [];

        stick[g][c].push({
            text,
            lastId: null,
            uses: 0
        });

        stickSystem.save();

        message.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setColor('#EC1D1D')
                    .setDescription('🧷 Stick activado')
            ]
        });
    }
};
