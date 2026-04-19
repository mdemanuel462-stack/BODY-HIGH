const { PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'unmute',

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

        if (!message.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
            return error('No tienes permisos.');
        }

        const user = message.mentions.members.first();

        if (!user) {
            return error('Menciona un usuario.');
        }

        if (!user.moderatable) {
            return error('No puedo desmutear a ese usuario.');
        }

        await user.timeout(0);

        const embed = new EmbedBuilder()
            .setColor('#EC1D1D')
            .setTitle('Usuario desmuteado')
            .setDescription(`**${user.user.tag}** puede hablar nuevamente`)
            .addFields(
                { name: '👮 Moderador', value: message.author.tag }
            )
            .setFooter({ text: 'El silencio terminó...' })
            .setTimestamp();

        message.channel.send({ embeds: [embed] });

    }
};
