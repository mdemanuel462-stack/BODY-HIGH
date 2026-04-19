const { PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'unlock',

    async execute(message) {

        const error = (txt) => {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor('#EC1D1D')
                        .setDescription(`❌ ${txt}`)
                ]
            });
        };

        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
            return error('No tienes permisos.');
        }

        try {
            await message.channel.permissionOverwrites.edit(
                message.guild.roles.everyone,
                { SendMessages: true }
            );

            const embed = new EmbedBuilder()
                .setColor('#EC1D1D')
                .setTitle('🔓 Canal desbloqueado')
                .setDescription('Los usuarios pueden enviar mensajes nuevamente.')
                .setFooter({ text: '' })
                .setTimestamp();

            message.channel.send({ embeds: [embed] });

        } catch (err) {
            console.error(err);
            return error('No pude desbloquear el canal.');
        }

    }
};
