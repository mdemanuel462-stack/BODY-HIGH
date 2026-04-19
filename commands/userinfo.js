const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'userinfo',

    async execute(message, args) {

        const user = message.mentions.users.first() || message.author;
        const member = message.guild.members.cache.get(user.id);

        const statusMap = {
            online: '🟢 En línea',
            idle: '🌙 Ausente',
            dnd: '⛔ No molestar',
            offline: '⚫ Desconectado'
        };

        const status = member?.presence?.status || 'offline';

        let actividad = 'Nada';

        if (member?.presence?.activities?.length) {
            const act = member.presence.activities[0];

            const typeMap = {
                0: 'Jugando a',
                1: 'Transmitiendo',
                2: 'Escuchando',
                3: 'Viendo',
                5: 'Compitiendo en'
            };

            actividad = `${typeMap[act.type] || 'Haciendo'} **${act.name}**`;
        }

        const roles = member
            ? member.roles.cache
                .filter(r => r.id !== message.guild.id)
                .map(r => r.toString())
                .slice(0, 10)
                .join(', ') || 'Ninguno'
            : 'Ninguno';

        const embed = new EmbedBuilder()
            .setColor('#EC1D1D')
            .setTitle(` ${user.tag}`)
            .setThumbnail(user.displayAvatarURL({ dynamic: true }))
            .addFields(
                { name: 'ID', value: user.id, inline: true },
                { name: 'Cuenta creada', value: `<t:${Math.floor(user.createdTimestamp / 1000)}:R>`, inline: true },
                { name: 'Entró al servidor', value: member ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>` : 'Desconocido', inline: true },
                { name: 'Estado', value: statusMap[status], inline: true },
                { name: 'Actividad', value: actividad, inline: true },
                { name: ' Bot', value: user.bot ? 'Sí' : 'No', inline: true },
                { name: ' Roles', value: roles }
            )
            .setFooter({ text: '' })
            .setTimestamp();

        message.channel.send({ embeds: [embed] });

    }
};
