const { PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'mute',

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

        if (user.id === message.author.id) {
            return error('No puedes mutearte a ti mismo.');
        }

        if (user.id === message.guild.ownerId) {
            return error('No puedes mutear al dueño del servidor.');
        }

        if (!user.moderatable) {
            return error('No puedo mutear a ese usuario.');
        }

        const tiempo = 10 * 60 * 1000;

        await user.timeout(tiempo);

        const embed = new EmbedBuilder()
            .setColor('#EC1D1D')
            .setTitle('🔇 Usuario muteado')
            .setDescription(`**${user.user.tag}** fue silenciado por 10 minutos`)
            .addFields(
                { name: '👮 Moderador', value: message.author.tag }
            )
            .setFooter({ text: '' })
            .setTimestamp();

        message.channel.send({ embeds: [embed] });

    }
};
