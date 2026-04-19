const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const { parseMessage } = require('../systems/embedBuilder');

module.exports = {
    name: 'loadembed',

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

        const name = args[0];

        if (!name) {
            return error('Escribe el nombre');
        }

        if (!fs.existsSync('./embeds.json')) {
            return error('No hay embeds guardados');
        }

        let data;

        try {
            data = JSON.parse(fs.readFileSync('./embeds.json', 'utf8'));
        } catch (err) {
            return error('Error leyendo embeds');
        }

        if (!data[name]) {
            return error('No existe ese embed');
        }

        try {
            const { embeds, components } = parseMessage(data[name]);

            await message.channel.send({
                embeds,
                components
            });

        } catch (err) {
            console.error(err);

            return error('Error al cargar el embed.');
        }

    }
};
