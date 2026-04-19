const { PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'clearwarns',

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

        if (!message.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
            return error('No tienes permisos.');
        }

        const user = message.mentions.users.first();
        if (!user) return error('Menciona un usuario.');

        warns[user.id] = [];
        save();

        const embed = new EmbedBuilder()
            .setColor('#EC1D1D')
            .setTitle('🧹 Advertencias limpiadas')
            .setDescription(`Las advertencias de **${user.tag}** fueron eliminadas`)
            .setFooter({ text: 'Derry perdona... por ahora' })
            .setTimestamp();

        message.channel.send({ embeds: [embed] });

    }
};
