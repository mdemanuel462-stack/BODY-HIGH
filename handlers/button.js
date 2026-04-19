if (interaction.isButton()) {
    if (!interaction.guild) return;

    await interaction.deferReply({ ephemeral: true });

    const error = (texto) => {
        return interaction.followUp({
            embeds: [
                new EmbedBuilder()
                    .setColor('#EC1D1D')
                    .setDescription(`❌ ${texto}`)
            ],
            ephemeral: true
        });
    };

    try {

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            return error('Necesitas permisos de moderador para usar esto.');
        }

        const [action, id] = interaction.customId.split('_');
        const conf = confesiones.find(c => c.id == id);

        if (!conf) {
            return error('Confesión no encontrada.');
        }

        const serverConfig = config[interaction.guild.id];
        if (!serverConfig?.confesiones) return;

        const canal = client.channels.cache.get(serverConfig.confesiones);
        if (!canal) return;

        if (action === 'approve') {

            const embedConf = new EmbedBuilder()
                .setColor('#EC1D1D')
                .setTitle(`Confesión (#${id})`)
                .setDescription(`"${conf.texto}"`)
                .setFooter({ text: 'Derry...' });

            await canal.send({ embeds: [embedConf] });

            await interaction.followUp({
                embeds: [
                    new EmbedBuilder()
                        .setColor('#EC1D1D')
                        .setDescription(`✅ Confesión **#${id}** aprobada`)
                ],
                ephemeral: true
            });

            await sendLog(interaction.guild, {
                embeds: [
                    new EmbedBuilder()
                        .setColor('#00FF7F')
                        .setTitle('📜 Confesión aprobada')
                        .addFields(
                            { name: 'ID', value: `#${id}`, inline: true },
                            { name: 'Moderador', value: interaction.user.tag, inline: true },
                            { name: 'Canal', value: `<#${canal.id}>`, inline: true }
                        )
                        .setTimestamp()
                ]
            });

            confesiones = confesiones.filter(c => c.id != id);
            save();

            try {
                await interaction.message.edit({ components: [] });
            } catch {}
        }

        if (action === 'deny') {

            await interaction.followUp({
                embeds: [
                    new EmbedBuilder()
                        .setColor('#EC1D1D')
                        .setDescription(`❌ Confesión **#${id}** rechazada`)
                ],
                ephemeral: true
            });

            await sendLog(interaction.guild, {
                embeds: [
                    new EmbedBuilder()
                        .setColor('#EC1D1D')
                        .setTitle('📜 Confesión rechazada')
                        .addFields(
                            { name: 'ID', value: `#${id}`, inline: true },
                            { name: 'Moderador', value: interaction.user.tag, inline: true },
                            { name: 'Canal', value: `<#${canal.id}>`, inline: true }
                        )
                        .setTimestamp()
                ]
            });

            confesiones = confesiones.filter(c => c.id != id);
            save();

            try {
                await interaction.message.edit({ components: [] });
            } catch {}
        }

    } catch (err) {
        console.error('❌ Error en botones:', err);

        interaction.followUp({
            embeds: [
                new EmbedBuilder()
                    .setColor('#EC1D1D')
                    .setDescription('❌ Ocurrió un error inesperado...')
            ],
            ephemeral: true
        });
    }
}
