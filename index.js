const fs = require('fs');

client.commands = new Map();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

const stickHandler = require('./handlers/stick'); // o sticky si no cambiaste
const interactionHandler = require('./handlers/interaction');

client.on('messageCreate', async (message) => {

    if (message.author.bot) return;
    if (!message.guild) return;

    stickHandler(message);

    const prefix = '!';

    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const cmd = args.shift().toLowerCase();

    const command = client.commands.get(cmd);

    if (!command) return;

    try {
        command.execute(message, args, client);
    } catch (err) {
        console.error(err);
    }
});

client.on('interactionCreate', async (interaction) => {
    interactionHandler(interaction, client);
});
