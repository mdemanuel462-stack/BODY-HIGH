const fs = require('fs');
const path = './data/embeds.json';

function load() {
    if (!fs.existsSync(path)) {
        fs.writeFileSync(path, '{}');
    }
    return JSON.parse(fs.readFileSync(path));
}

function save(data) {
    fs.writeFileSync(path, JSON.stringify(data, null, 2));
}

function saveEmbed(guildId, name, content) {
    const data = load();

    if (!data[guildId]) data[guildId] = {};

    data[guildId][name] = content;

    save(data);
}

function getEmbed(guildId, name) {
    const data = load();
    return data[guildId]?.[name];
}

function deleteEmbed(guildId, name) {
    const data = load();

    if (data[guildId]?.[name]) {
        delete data[guildId][name];
        save(data);
        return true;
    }

    return false;
}

module.exports = {
    saveEmbed,
    getEmbed,
    deleteEmbed
};
