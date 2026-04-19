const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: 'confesar',

    async execute(message, args, client) {

        const error = (txt) => {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor('#EC1D1D')
                        .setDescription(`❌ ${txt}`)
                ]
            });
        };

        const texto = args.join(' ').trim();

        if (!texto) {
            return error('Escribe tu confesión.');
        }

        if (confesiones.find(c => c.texto === texto)) {
            return error('Esa confesión ya fue enviada.');
        }

        lastConfesionId++;
        const id = lastConfesionId;

        confesiones.push({ id, texto, userId: message.author.id });

        save();

        const serverConfig = config[message.guild.id];

        if (!serverConfig?.logs || !serverConfig?.confesiones) {
            return error('Configura primero con !setlogs y !setconfesiones');
        }

        const logChannel = client.channels.cache.get(serverConfig.logs);
        if (!logChannel) return error('Canal inválido.');

        const embed = new EmbedBuilder()
            .setColor('#EC1D1D')
            .setTitle(`Confesión pendiente (#${id})`)
            .setDescription(`"${texto}"`)
            .addFields(
                { name: 'Usuario', value: message.author.tag },
                { name: 'Estado', value: 'En espera' }
            )
            .setFooter({ text: '' })
            .setTimestamp();

        const botones = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId(`approve_${id}`)
                .setLabel('Aprobar')
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
                .setCustomId(`deny_${id}`)
                .setLabel('Denegar')
                .setStyle(ButtonStyle.Danger)
        );

        await logChannel.send({ embeds: [embed], components: [botones] });

        await message.delete().catch(() => {});

        message.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setColor('#EC1D1D')
                    .setDescription('Tu confesión fue enviada para revisión...')
            ]
        });
    }
};
