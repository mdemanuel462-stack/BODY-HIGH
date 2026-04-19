const { PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'warn',

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

        const user = message.mentions.members.first();

        if (!user) {
            return error('Menciona un usuario.');
        }

        if (user.id === message.author.id) {
            return error('No puedes advertirte a ti mismo.');
        }

        if (user.id === message.guild.ownerId) {
            return error('No puedes advertir al dueño del servidor.');
        }

        if (user.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return error('No puedes advertir a un administrador.');
        }

        const reason = args.slice(1).join(' ') || 'Sin razón';

        if (!warns[user.id]) warns[user.id] = [];

        warns[user.id].push({
            reason,
            mod: message.author.tag,
            date: Date.now()
        });

        save();

        const total = warns[user.id].length;

        sendLog(message.guild, {
            embeds: [
                new EmbedBuilder()
                    .setColor('#EC1D1D')
                    .setTitle('Advertencia')
                    .setDescription(`${user.user.tag} recibió un warn`)
                    .addFields(
                        { name: 'Moderador', value: message.author.tag },
                        { name: 'Razón', value: reason },
                        { name: 'Total', value: `${total}` }
                    )
                    .setTimestamp()
            ]
        });

        const embed = new EmbedBuilder()
            .setColor('#EC1D1D')
            .setTitle('Usuario advertido')
            .setDescription(`**${user.user.tag}** ha sido advertido`)
            .addFields(
                { name: 'Razón', value: reason },
                { name: 'Total de advertencias', value: `${total}` }
            )
            .setFooter({ text: '' })
            .setTimestamp();

        message.channel.send({ embeds: [embed] });

    }
};
