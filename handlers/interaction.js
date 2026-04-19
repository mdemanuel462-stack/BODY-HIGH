const { EmbedBuilder } = require('discord.js');

module.exports = async (interaction) => {

    const reply = (txt) => {
        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor('#EC1D1D')
                    .setDescription(txt)
            ],
            ephemeral: true
        });
    };

    if (interaction.isButton()) {

        if (interaction.customId === 'btn1') {
            return reply('Botón 1 presionado');
        }

        if (interaction.customId === 'btn2') {
            return reply('Información mostrada');
        }
    }

    if (interaction.isStringSelectMenu()) {

        return reply(`Elegiste: **${interaction.values[0]}**`);
    }
};
