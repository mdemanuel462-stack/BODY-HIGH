module.exports = async (interaction) => {

    if (interaction.isButton()) {

        if (interaction.customId === 'btn1') {
            return interaction.reply({
                content: '🔥 Botón 1 presionado',
                ephemeral: true
            });
        }

        if (interaction.customId === 'btn2') {
            return interaction.reply({
                content: 'ℹ️ Info',
                ephemeral: true
            });
        }
    }

    if (interaction.isStringSelectMenu()) {
        return interaction.reply({
            content: `Elegiste: ${interaction.values[0]}`,
            ephemeral: true
        });
    }
};
