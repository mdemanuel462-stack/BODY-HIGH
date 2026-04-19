const { PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'lock',

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
                { SendMessages: false }
            );

            const embed = new EmbedBuilder()
                .setColor('#EC1D1D')
                .setTitle('🔒 Canal bloqueado')
                .setDescription('Este canal ha sido bloqueado. Nadie puede enviar mensajes.')
                .setFooter({ text: 'Derry controla el silencio...' })
                .setTimestamp();

            message.channel.send({ embeds: [embed] });

        } catch (err) {
            console.error(err);
            return error('No pude bloquear el canal.');
        }

    }
};
