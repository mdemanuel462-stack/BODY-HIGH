if (message.content.startsWith('!warn ')) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
        return message.reply('❌ No tienes permisos.');
    }

    const user =
   message.mentions.members.first();
    if (!user) return message.reply('⚠️ Menciona un usuario.');

    const args = message.content.split(' ');
    const reason = args.slice(2).join(' ') || 'Sin razón';

    if (!warns[user.id]) warns[user.id] = [];

    warns[user.id].push({
        reason,
        mod: message.author.tag,
        date: Date.now()
    });

    save();

    sendLog(message.guild, {
        embeds: [
            new EmbedBuilder()
                .setColor('#EC1D1D')
                .setTitle('📜 Warn')
                .setDescription(`⚠️ ${user.user.tag} recibió un warn`)
                .addFields(
                    { name: 'Moderador', value: message.author.tag },
                    { name: 'Razón', value: reason }
                )
                .setTimestamp()
        ]
    });
message.channel.send(`⚠️ ${user.user.tag} advertido.\nTotal warns: ${warns[user.id].length}`);
}

    
