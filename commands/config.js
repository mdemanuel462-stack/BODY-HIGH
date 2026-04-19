const { PermissionsBitField, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

module.exports = {
    name: 'config',

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

        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return error('No tienes permisos.');
        }

        const embed = new EmbedBuilder()
            .setColor('#EC1D1D')
            .setTitle('⚙️ Panel de Configuración')
            .setDescription('Bienvenido a Body High...\nSelecciona una opción abajo.')
            .setThumbnail('https://i.imgur.com/8Km9tLL.png')
            .setFooter({ text: '' })
            .setTimestamp();

        const menu = new StringSelectMenuBuilder()
            .setCustomId('config_menu')
            .setPlaceholder('Selecciona una opción...')
            .addOptions([
                {
                    label: 'Canales de Confesión',
                    description: 'Configurar canal de confesiones',
                    value: 'confesiones',
                    emoji: '💬'
                },
                {
                    label: 'Canal de Logs',
                    description: 'Configurar canal de registros',
                    value: 'logs',
                    emoji: '📜'
                },
                {
                    label: 'Moderación',
                    description: 'Configurar filtros y seguridad',
                    value: 'mod',
                    emoji: '⚠️'
                }
            ]);

        const row = new ActionRowBuilder().addComponents(menu);

        message.channel.send({
            embeds: [embed],
            components: [row]
        });

    }
};
