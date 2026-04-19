const fs = require('fs');

let sticky = {};
let lock = {};

if (fs.existsSync('./sticky.json')) {
    sticky = JSON.parse(fs.readFileSync('./sticky.json'));
}

function save() {
    fs.writeFileSync('./sticky.json', JSON.stringify(sticky, null, 2));
}

module.exports = async (message) => {

    if (!message.guild) return;
    if (message.author.bot) return;

    const guildId = message.guild.id;
    const channelId = message.channel.id;

    const stickies = sticky[guildId]?.[channelId];
    if (!stickies) return;

    if (message.content.startsWith('!')) return;

    if (stickies.some(s => s.lastId === message.id)) return;

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

        save();

    } catch (err) {
        console.log('Sticky error:', err);
    }

    setTimeout(() => {
        lock[key] = false;
    }, 1200);
};

// exportamos para usar en comandos
module.exports.data = sticky;
module.exports.save = save;
