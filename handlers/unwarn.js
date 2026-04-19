const { PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'unwarn',

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

        if (!user) {
            return error('Menciona un usuario.');
        }

        if (!warns[user.id] || warns[user.id].length === 0) {
            return error('Ese usuario no tiene advertencias.');
        }

        warns[user.id].pop();

        save();

        const restante = warns[user.id].length;

        const embed = new EmbedBuilder()
            .setColor('#EC1D1D')
            .setTitle('⚠️ Advertencia eliminada')
            .setDescription(`Se eliminó una advertencia de **${user.tag}**`)
            .addFields(
                { name: 'Advertencias restantes', value: `${restante}` }
            )
            .setFooter({ text: '' })
            .setTimestamp();

        message.channel.send({ embeds: [embed] });

    }
};
