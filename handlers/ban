const { PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'ban',

    async execute(message, args, client) {

        const error = (texto) => {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor('#EC1D1D')
                        .setDescription(`❌ ${texto}`)
                ]
            });
        };

        if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            return error('No tienes permisos.');
        }

        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        const reason = args.slice(1).join(' ') || 'Sin razón';

        if (!user) {
            return error('Debes mencionar a un usuario o poner su ID.');
        }

        if (user.id === message.author.id) {
            return error('No puedes banearte a ti mismo.');
        }

        if (user.id === message.guild.ownerId) {
            return error('No puedes banear al dueño del servidor.');
        }

        if (user.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return error('No puedes banear a un administrador.');
        }

        if (!user.bannable) {
            return error('No puedo banear a ese usuario.');
        }

        await user.ban({ reason });

        const embed = new EmbedBuilder()
            .setColor('#EC1D1D')
            .setTitle('🔨 Usuario Baneado')
            .setDescription(`**${user.user.tag}** ha sido baneado del servidor`)
            .addFields(
                { name: '👮 Moderador', value: message.author.tag, inline: true },
                { name: '📝 Razón', value: reason, inline: true }
            )
            .setFooter({ text: '' })
            .setTimestamp();

        message.channel.send({ embeds: [embed] });

    }
};
