if (interaction.isStringSelectMenu()) {

    if (interaction.customId === 'config_menu') {

        const value = interaction.values[0];

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

        if (value === 'confesiones') {
            return reply('💬 Usa: **!setconfesiones #canal**');
        }

        if (value === 'logs') {
            return reply('📜 Usa: **!setlogs #canal**');
        }

        if (value === 'mod') {
            return reply('⚠️ Sistema en desarrollo...');
        }
    }
}
