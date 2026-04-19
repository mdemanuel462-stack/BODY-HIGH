const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'serverinfo',

    async execute(message) {

        const guild = message.guild;

        const owner = await guild.fetchOwner().catch(() => null);

        const roles = guild.roles.cache
            .filter(r => r.id !== guild.id)
            .map(r => r.toString())
            .slice(0, 10)
            .join(', ') || 'Ninguno';

        const embed = new EmbedBuilder()
            .setColor('#EC1D1D')
            .setTitle(`${guild.name}`)
            .setThumbnail(guild.iconURL({ dynamic: true }))
            .addFields(
                { name: 'Dueño', value: owner ? owner.user.tag : 'Desconocido', inline: true },
                { name: 'ID', value: guild.id, inline: true },
                { name: 'Miembros', value: `${guild.memberCount}`, inline: true },
                { name: 'Canales', value: `${guild.channels.cache.size}`, inline: true },
                { name: 'Roles', value: `${guild.roles.cache.size}`, inline: true },
                { name: 'Creado', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:R>`, inline: true },
                { name: 'Algunos roles', value: roles }
            )
            .setFooter({ text: '' })
            .setTimestamp();

        message.channel.send({ embeds: [embed] });

    }
};
