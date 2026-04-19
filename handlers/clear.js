const { PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'clear',

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

        if (!message.guild) return;

        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            return error('No tienes permisos.');
        }

        if (!args[0]) {
            return error('Usa: !clear <cantidad> | @user | bots | links');
        }

        let fetched;

        try {
            // ⚠️ Discord límite real = 100
            fetched = await message.channel.messages.fetch({ limit: 100 });
        } catch {
            return error('Error al obtener mensajes.');
        }

        let filtered = fetched;

        if (message.mentions.users.first()) {
            const user = message.mentions.users.first();
            filtered = fetched.filter(msg => msg.author.id === user.id);
        }

        else if (args[0] === 'bots') {
            filtered = fetched.filter(msg => msg.author.bot);
        }

        else if (args[0] === 'links') {
            filtered = fetched.filter(msg => msg.content.includes('http'));
        }

        else {
            const cantidad = parseInt(args[0]);

            if (isNaN(cantidad) || cantidad < 1 || cantidad > 100) {
                return error('Número inválido (1-100).');
            }

            filtered = fetched.first(cantidad);
        }

        try {
            await message.channel.bulkDelete(filtered, true);

            const cantidad = filtered.size ?? filtered.length ?? 0;

            const embed = new EmbedBuilder()
                .setColor('#EC1D1D')
                .setTitle('🧹 Limpieza completada')
                .setDescription(`Se eliminaron **${cantidad} mensajes**`)
                .setFooter({ text: 'Derry limpia todo...' })
                .setTimestamp();

            message.channel.send({ embeds: [embed] })
                .then(msg => setTimeout(() => msg.delete().catch(() => {}), 4000));

        } catch {
            return error('No pude borrar los mensajes.');
        }

    }
};
