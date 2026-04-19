const fs = require('fs');
const path = require('path');

client.commands = new Map();

const commandFiles = fs.readdirSync('./handlers').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./handlers/${file}`);
    client.commands.set(command.name, command);
}
