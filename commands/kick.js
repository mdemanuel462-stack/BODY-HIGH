const { PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'kick',

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

        const user = message.mentions.members.first();

        if (!user) {
            return error('Menciona un usuario.');
        }

        if (user.id === message.author.id) {
            return error('No puedes expulsarte a ti mismo.');
        }

        if (user.id === message.guild.ownerId) {
            return error('No puedes expulsar al dueño del servidor.');
        }

        if (user.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return error('No puedes expulsar a un administrador.');
        }

        if (!user.kickable) {
            return error('No puedo expulsar a ese usuario.');
        }

        await user.kick();

        const embed = new EmbedBuilder()
            .setColor('#EC1D1D')
            .setTitle('👢 Usuario expulsado')
            .setDescription(`**${user.user.tag}** fue expulsado del servidor`)
            .addFields(
                { name: '👮 Moderador', value: message.author.tag }
            )
            .setFooter({ text: '' })
            .setTimestamp();

        message.channel.send({ embeds: [embed] });

        await sendLog(message.guild, {
            embeds: [
                new EmbedBuilder()
                    .setColor('#EC1D1D')
                    .setTitle('📜 Log de Moderación')
                    .setDescription(`👢 ${user.user.tag} fue expulsado`)
                    .addFields(
                        { name: 'Moderador', value: message.author.tag }
                    )
                    .setTimestamp()
            ]
        });

    }
};
