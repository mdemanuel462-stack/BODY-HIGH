const { PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'setlogs',

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

        const channel = message.mentions.channels.first();

        if (!channel) {
            return error('Menciona un canal.');
        }

        if (!config[message.guild.id]) {
            config[message.guild.id] = {};
        }

        config[message.guild.id].logs = channel.id;

        save();

        const embed = new EmbedBuilder()
            .setColor('#EC1D1D')
            .setTitle('Configuración actualizada')
            .setDescription(`Canal de logs configurado: ${channel}`)
            .setFooter({ text: '' })
            .setTimestamp();

        message.channel.send({ embeds: [embed] });

    }
};
