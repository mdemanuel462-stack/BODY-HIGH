const fs = require('fs');
const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.commands = new Map();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

const stickHandler = require('./handlers/sticky'); // o stick
const interactionHandler = require('./handlers/interaction');

client.on('messageCreate', async (message) => {

    if (message.author.bot) return;
    if (!message.guild) return;

    stickHandler(message);

    const prefix = '!';

    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const cmd = args.shift().toLowerCase();

    const command =
        client.commands.get(cmd) ||
        [...client.commands.values()].find(c => c.aliases?.includes(cmd));

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

client.login(process.env.TOKEN);
