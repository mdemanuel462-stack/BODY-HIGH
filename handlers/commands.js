const { parseMessage } = require('../systems/embedBuilder');
const db = require('../systems/database');

module.exports = async (message) => {

    if (message.author.bot) return;

    const prefix = '!';

    if (!message.content.startsWith(prefix)) return;

    const [cmd, ...args] = message.content.slice(prefix.length).split(' ');

    // ======================
    // EMBED NORMAL
    // ======================
    if (cmd === 'embed') {

        const full = args.join(' ')
            .replace(/\n/g, ' ')
            .trim();

        const parts = full.split('|');

        const content = parts[0]?.trim();
        const embedText = parts.slice(1).join('|').trim();

        const { embeds, components } = parseMessage(embedText, message);

        if (!embeds.length) {
            return message.reply('❌ Embed inválido');
        }

        message.channel.send({
            content,
            embeds,
            components
        });
    }

    // ======================
    // SAVE
    // ======================
    if (cmd === 'saveembed') {

        const raw = args.join(' ');
        const parts = raw.split('|');

        const name = parts[0]?.trim();
        const content = parts.slice(1).join('|').trim();

        if (!name || !content) {
            return message.reply('❌ Uso: !saveembed nombre | embed');
        }

        db.saveEmbed(message.guild.id, name, content);

        message.reply(`✅ Guardado: ${name}`);
    }

    // ======================
    // LOAD
    // ======================
    if (cmd === 'loadembed') {

        const name = args[0];

        const data = db.getEmbed(message.guild.id, name);

        if (!data) return message.reply('❌ No existe');

        const { embeds, components } = parseMessage(data, message);

        message.channel.send({ embeds, components });
    }

    // ======================
    // DELETE
    // ======================
    if (cmd === 'deleteembed') {

        const name = args[0];

        if (!db.deleteEmbed(message.guild.id, name)) {
            return message.reply('❌ No existe');
        }

        message.reply('🗑️ Eliminado');
    }
};
