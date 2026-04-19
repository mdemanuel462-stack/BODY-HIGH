const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
    name: 'setconfesiones',

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

        const canal = message.mentions.channels.first();

        if (!canal) {
            return error('Menciona un canal.');
        }

        if (!config[message.guild.id]) {
            config[message.guild.id] = {};
        }

        config[message.guild.id].confesiones = canal.id;

        fs.writeFileSync('./config.json', JSON.stringify(config, null, 2));

        const embed = new EmbedBuilder()
            .setColor('#EC1D1D')
            .setTitle('Configuración actualizada')
            .setDescription(`Canal de confesiones configurado en ${canal}`)
            .setFooter({ text: '' })
            .setTimestamp();

        message.channel.send({ embeds: [embed] });

    }
};
