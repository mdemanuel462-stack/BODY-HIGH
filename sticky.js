const { PermissionsBitField } = require('discord.js');
const fs = require('fs');

module.exports = (client) => {

let sticky = {};
let lock = {}; // 🔒 anti-spam por canal

if (fs.existsSync('./sticky.json')) {
    sticky = JSON.parse(fs.readFileSync('./sticky.json'));
}

function save() {
    fs.writeFileSync('./sticky.json', JSON.stringify(sticky, null, 2));
}

client.on('messageCreate', async (message) => {

    // =======================
    // 🚫 FILTROS
    // =======================

    if (!message.guild) return;
    if (message.author.bot) return;

    const guildId = message.guild.id;
    const channelId = message.channel.id;

    // =======================
    // 🧷 CREAR STICKY
    // =======================

    if (message.content.startsWith('!sticky ')) {

        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            return message.reply('❌ No tienes permisos.');
        }

        const text = message.content.slice(8).trim();
        if (!text) return message.reply('⚠️ Escribe un mensaje.');

        if (!sticky[guildId]) sticky[guildId] = {};
        if (!sticky[guildId][channelId]) sticky[guildId][channelId] = [];

        sticky[guildId][channelId].push({
            text,
            lastId: null,
            uses: 0
        });

        save();
        return message.reply('🧷 Sticky activado.');
    }

    // =======================
    // ❌ BORRAR TODOS
    // =======================

    if (message.content === '!unsticky') {

        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            return message.reply('❌ No tienes permisos.');
        }

        if (sticky[guildId]) {
            delete sticky[guildId][channelId];
        }

        save();
        return message.reply('❌ Sticky eliminado.');
    }

    // =======================
    // ❌ BORRAR UNO
    // =======================

    if (message.content.startsWith('!unstickys')) {

        const index = parseInt(message.content.split(' ')[1]) - 1;
        const data = sticky[guildId]?.[channelId];

        if (!data || !data[index]) {
            return message.reply('❌ Número inválido.');
        }

        data.splice(index, 1);
        save();

        return message.reply('🗑️ Sticky eliminado.');
    }

    // =======================
    // 📊 STATS
    // =======================

    if (message.content === '!stickystats') {

        const data = sticky[guildId]?.[channelId];

        if (!data || data.length === 0) {
            return message.reply('❌ No hay sticky en este canal.');
        }

        let texto = '📊 **Sticky Stats:**\n\n';

        data.forEach((s, i) => {
            texto += `#${i + 1}\n🧷 ${s.text}\n🔁 Usos: ${s.uses}\n\n`;
        });

        return message.reply(texto);
    }

    // =======================
    // 🔄 STICKY AUTO
    // =======================

    const stickies = sticky[guildId]?.[channelId];
    if (!stickies) return;

    // ignorar comandos
    if (message.content.startsWith('!')) return;

    // 🚫 evitar loop
    if (stickies.some(s => s.lastId === message.id)) return;

    // 🚫 anti spam por canal
    const key = guildId + channelId;

    if (lock[key]) return;
    lock[key] = true;

    try {

        for (const data of stickies) {

            if (data.lastId) {
                await message.channel.messages.delete(data.lastId).catch(() => {});
            }

            await new Promise(res => setTimeout(res, 120));

            const msg = await message.channel.send(data.text);

            data.lastId = msg.id;
            data.uses++;
        }

        save(); // 💾 solo 1 vez (optimizado)

    } catch (err) {
        console.log('Sticky error:', err);
    }

    // liberar lock
    setTimeout(() => {
        lock[key] = false;
    }, 1200);

});

};
