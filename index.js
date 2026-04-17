require('dotenv').config();
if (!process.env.TOKEN) {
    console.log('❌ TOKEN no detectado en .env');
    process.exit(1);
}

const {
    Client,
    GatewayIntentBits,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    PermissionsBitField,
    StringSelectMenuBuilder,
} = require('discord.js');

const fs = require('fs');

const path = './data/embeds.json';

// Cargar
function getData() {
    if (!fs.existsSync(path)) {
        fs.writeFileSync(path, '{}');
    }

    return JSON.parse(fs.readFileSync(path));
}

// Guardar
function saveData(data) {
    fs.writeFileSync(path, JSON.stringify(data, null, 2));
}

// Guardar embed por servidor
function saveEmbed(guildId, name, content) {
    const data = getData();

    if (!data[guildId]) data[guildId] = {};

    data[guildId][name] = content;

    saveData(data);
}

// Obtener embed
function getEmbed(guildId, name) {
    const data = getData();
    return data[guildId]?.[name];
}

// Eliminar embed
function deleteEmbed(guildId, name) {
    const data = getData();

    if (data[guildId]?.[name]) {
        delete data[guildId][name];
        saveData(data);
        return true;
    }

    return false;
}

module.exports = {
    saveEmbed,
    getEmbed,
    deleteEmbed
};

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

require('./sticky')(client);

async function sendLog(guild, data) {
    try {
        const serverConfig = config[guild.id];
        if (!serverConfig?.logs) return;

        const canal = guild.channels.cache.get(serverConfig.logs);
        if (!canal) return;

        await canal.send(data);
    } catch (err) {
        console.error('Error en logs:', err);
    }
}


    function save() {
    try {
        fs.writeFileSync('./confesiones.json', JSON.stringify({
            lastId: lastConfesionId,
            confesiones: confesiones
        }, null, 2));
    } catch (err) {
        console.error('❌ Error guardando confesiones:', err);
    }

    try {
        fs.writeFileSync('./warns.json', JSON.stringify(warns, null, 2));
    } catch (err) {
        console.error('❌ Error guardando warns:', err);
    }

    try {
        fs.writeFileSync('./kisses.json', JSON.stringify(kissCount, null, 2));
    } catch (err) {
        console.error('❌ Error guardando kisses:', err);
    }

    try {
        fs.writeFileSync('./globalKisses.json', JSON.stringify(globalKisses, null, 2));
    } catch (err) {
        console.error('❌ Error guardando globalKisses:', err);
    }
}

// =======================
// 📂 DATOS
// =======================
let kissCount = {};
let confesiones = [];
let globalKisses = 0;
let config = {};
let lastConfesionId = 0;
let warns = {};

try {
    if (fs.existsSync('./warns.json')) {
        warns = JSON.parse(fs.readFileSync('./warns.json', 'utf8'));
    }
} catch {}

 try {
const raw = fs.readFileSync('./confesiones.json', 'utf8');
const data = JSON.parse(raw);

if (!fs.existsSync('./warns.json')) {
    fs.writeFileSync('./warns.json', '{}');
}

try {
    warns = JSON.parse(fs.readFileSync('./warns.json', 'utf8'));
} catch {
    warns = {};
}

if (typeof data === 'object') {
    confesiones = data.confesiones || [];
    lastConfesionId = data.lastId || 0;
}

} catch {
confesiones = [];
lastConfesionId = 0;
}

try {
    if (fs.existsSync('./config.json')) {
        config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
    }
} catch {}

try {
    if (fs.existsSync('./kisses.json')) {
        kissCount = JSON.parse(fs.readFileSync('./kisses.json', 'utf8'));
    }
} catch {}

try {
    if (fs.existsSync('./globalKisses.json')) {
        globalKisses = JSON.parse(fs.readFileSync('./globalKisses.json', 'utf8'));
    }
} catch {}

// =======================
client.once('ready', () => {
    console.log(`🎈 Bot listo como ${client.user.tag}`);
});


client.on('interactionCreate', async interaction => {


    // ======================
    // 📋 MENÚ CONFIG
    // ======================
    if (interaction.isStringSelectMenu()) {

        if (interaction.customId === 'config_menu') {

            const value = interaction.values[0];

            if (value === 'confesiones') {
                return interaction.reply({
                    content: '💬 Usa: !setconfesiones #canal',
                    ephemeral: true
                });
            }

            if (value === 'logs') {
                return interaction.reply({
                    content: '📜 Usa: !setlogs #canal',
                    ephemeral: true
                });
}

            if (value === 'mod') {
                return interaction.reply({
                    content: '⚠️ Sistema en desarrollo...',
                    ephemeral: true
                });
            }
        }
    }

    // ======================
    // 🔘 BOTONES CONFESIONES
    // ======================
    if (interaction.isButton()) {
    if (!interaction.guild) return;

await interaction.deferReply({ ephemeral: true });
    try {


        // 🔒 PERMISOS
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            return interaction.followUp({
                content: '❌ Necesitas permisos de moderador para usar esto.',
                ephemeral: true
            });
        }

        const [action, id] = interaction.customId.split('_');
        const conf = confesiones.find(c => c.id == id);

        if (!conf) {
            return interaction.followUp({
                content: '❌ Confesión no encontrada.',
                ephemeral: true
            });
        }

        const serverConfig = config[interaction.guild.id];
        if (!serverConfig?.confesiones) return;

        const canal = client.channels.cache.get(serverConfig.confesiones);
        if (!canal) return;

        // ✅ APPROVE
        if (action === 'approve') {
            const embed = new EmbedBuilder()
                .setColor('#EC1D1D')
                .setTitle(`🎈 Confesión (#${id})`)
                .setDescription(`"${conf.texto}"`)
                .setFooter({ text: 'Derry...' });

            await canal.send({ embeds: [embed] });

            await interaction.followUp({
                content: `✅ Confesión #${id} aprobada`,
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

        // ❌ DENY 
        if (action === 'deny') {
            await interaction.followUp({
                content: `❌ Confesión #${id} rechazada`,
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
    }
}

});

client.on('messageCreate', async message => {

if (message.content === 'test') {
    return message.reply('FUNCIONA ✅');
}
  if (!message.guild) return;

    if (message.author.bot) return;

if (message.content === 'ping') {
    return message.reply('pong 🏓');
}

// =======================
// ⚙️ CMD-CONFIG
// =======================

if (message.content === '!config') {

    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
        return message.reply('❌ No tienes permisos.');
    }

    const embed = new EmbedBuilder()
        .setColor('#6A0DAD')
        .setTitle('⚙️ Panel de Configuración')
        .setDescription('🎈 Bienvenido a Derry...\nSelecciona una opción abajo.')
        .setThumbnail('https://i.imgur.com/8Km9tLL.png');

    const menu = new StringSelectMenuBuilder()
        .setCustomId('config_menu')
        .setPlaceholder('Selecciona una opción...')
        .addOptions([
            {
                label: 'Canales de Confesión',
                description: 'Configurar canal de confesiones',
                value: 'confesiones',
                emoji: '💬'
            },
            {
                label: 'Canal de Logs',
                description: 'Configurar canal de registros',
                value: 'logs',
                emoji: '📜'
            },
            {
                label: 'Moderación',
                description: 'Configurar filtros y seguridad',
                value: 'mod',
                emoji: '⚠️'
            }
        ]);

    const row = new ActionRowBuilder().addComponents(menu);

    message.channel.send({
        embeds: [embed],
        components: [row]
});

}


    if (message.content.startsWith('!warnings')) {
        const user = message.mentions.users.first() || message.author;
        const count = warns[user.id]?.length || 0;


        message.channel.send(`📊 ${user.tag} tiene ${count} advertencias.`);
    }

    if (message.content.startsWith('!clearwarns')) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
            return message.reply('❌ No tienes permisos.');
        }

        const user = message.mentions.users.first();
        if (!user) return message.reply('❌ Menciona un usuario.');

        warns[user.id] = 0;
        save();

        message.channel.send(`🧹 Advertencias limpiadas para ${user.tag}`);
    }



    // =======================
    // 🔢 CMD-BAN
    // =======================
   if (message.content.startsWith('!ban ')) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
        return message.reply('❌ No tienes permisos.');
    }

const args = message.content.split(' ');
const user = message.mentions.members.first() || message.guild.members.cache.get(args[1]);
const reason = args.slice(2).join(' ') || 'Sin razón';

    if (!user) {
        return message.reply('⚠️ Debes mencionar a un usuario o poner su ID.');
    }

    // 🚫 No banearte a ti mismo
    if (user.id === message.author.id) {
        return message.reply('❌ No puedes banearte a ti mismo.');
    }

    // 🚫 No banear al dueño
    if (user.id === message.guild.ownerId) {
        return message.reply('❌ No puedes banear al dueño del servidor.');
    }

    // 🚫 PROTECCIÓN ADMIN
    if (user.permissions.has(PermissionsBitField.Flags.Administrator)) {
        return message.reply('❌ No puedes banear a un administrador.');
    }

    if (!user.bannable) {
        return message.reply('❌ No puedo banear a ese usuario.');
    }

    await user.ban({ reason });

    sendLog(message.guild, {
        embeds: [
            new EmbedBuilder()
                .setColor('#EC1D1D')
                .setTitle('📜 Log de Moderación')
                .setDescription(`🔨 ${user.user.tag} fue baneado`)
                .addFields(
                    { name: '👮 Moderador', value: message.author.tag },
                    { name: '📝 Razón', value: reason }
                )
                .setTimestamp()
        ]
    });

    message.channel.send(`🔨 ${user.user.tag} fue baneado.\n📝 Razón: ${reason}`);
}

    // =======================
    // 🔢 CMD-HARDBAN
    // =======================
    if (message.content.startsWith('!hb ')) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            return message.reply('❌ No tienes permisos.');
        }

        const args = message.content.split(' ');
        const user = message.mentions.members.first() || message.guild.members.cache.get(args[1]);
        const reason = args.slice(2).join(' ') || 'Sin razón';

        if (!user) {
            return message.reply('⚠️ Debes mencionar a un usuario o poner su ID.');
        }

        if (!user.bannable) {
            return message.reply('❌ No puedo banear a ese usuario.');
        }
if (user.id === message.author.id) {
    return message.reply('❌ No puedes banearte a ti mismo.');
}

if (user.id === message.guild.ownerId) {
    return message.reply('❌ No puedes banear al dueño del servidor.');
}

if (user.permissions.has(PermissionsBitField.Flags.Administrator)) {
    return message.reply('❌ No puedes banear a un administrador.');
}
        await user.ban({ deleteMessageSeconds: 604800, reason });
        message.channel.send(`☠️ ${user.user.tag} fue eliminado completamente.\n📝 Razón: ${reason}`);
    }
    // =======================
    // 🔢 CMD-CLEAR
    // =======================
    if (message.content.startsWith('!clear')) {
    if (!message.guild) return;

    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
        return message.reply('❌ No tienes permisos.');
    }

    const args = message.content.split(' ').slice(1);

    if (!args[0]) {
        return message.reply('⚠️ Usa: !clear <cantidad> | @user | bots | links');
    }

    let fetched;

    try {
        fetched = await message.channel.messages.fetch({ limit: 100 });
    } catch {
        return message.reply('⚠️ Error al obtener mensajes.');
    }

    let filtered = fetched;

    if (message.mentions.users.first()) {
        const user = message.mentions.users.first();
        filtered = fetched.filter(msg => msg.author.id === user.id);
    } else if (args[0] === 'bots') {
        filtered = fetched.filter(msg => msg.author.bot);
    } else if (args[0] === 'links') {
        filtered = fetched.filter(msg => msg.content.includes('http'));
    } else {
        const cantidad = parseInt(args[0]);

        if (isNaN(cantidad) || cantidad < 1 || cantidad > 100) {
            return message.reply('⚠️ Número inválido (1-100).');
        }

        filtered = fetched.first(cantidad);
    }

    try {
        await message.channel.bulkDelete(filtered, true);

        const cantidad = filtered.size ?? filtered.length ?? 0;

        message.channel.send(`🧹 Limpieza realizada (${cantidad} mensajes).`)
            .then(msg => setTimeout(() => msg.delete().catch(() => {}), 3000));
    } catch {
        message.reply('⚠️ No pude borrar los mensajes.');
    }
}

    if (message.content.startsWith('!kick ')) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
            return message.reply('❌ No tienes permisos.');
        }

        const user = message.mentions.members.first();

        if (!user) return message.reply('⚠️ Menciona un usuario.');
        if (!user.kickable) return message.reply('❌ No puedo expulsarlo.');

        await user.kick();
        await sendLog(message.guild, {
    embeds: [
        new EmbedBuilder()
            .setColor('#EC1D1D')
            .setTitle('📜 Log de Moderación')
            .setDescription(`👢 ${user.user.tag} fue expulsado`)
            .addFields(
                { name: 'Moderador', value: message.author.tag }
            )
            .setTimestamp()
    ]
});
}
       if (message.content.startsWith('!mute ')) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
        return message.reply('❌ No tienes permisos.');
    }
        const user = message.mentions.members.first();
        if (!user) return message.reply('⚠️ Menciona un usuario.');

        await user.timeout(10 * 60 * 1000);
        message.channel.send(`🔇 ${user.user.tag} fue muteado.`);
    }

    if (message.content.startsWith('!unmute ')) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
        return message.reply('❌ No tienes permisos.');
    }
        const user = message.mentions.members.first();
        if (!user) return message.reply('⚠️ Menciona un usuario.');

        await user.timeout(0);
        message.channel.send(`🔊 ${user.user.tag} fue desmuteado.`);
    }

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

    if (message.content === '!lock') {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
        return message.reply('❌ No tienes permisos.');
    }

    await message.channel.permissionOverwrites.edit(message.guild.roles.everyone, {
        SendMessages: false
    });

    message.channel.send('🔒 Canal bloqueado.');
}

if (message.content === '!unlock') {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
        return message.reply('❌ No tienes permisos.');
    }

    await message.channel.permissionOverwrites.edit(message.guild.roles.everyone, {
        SendMessages: true
    });

    message.channel.send('🔓 Canal desbloqueado.');
}

    if (message.content.startsWith('!userinfo')) {
        const user = message.mentions.users.first() || message.author;

        const embed = new EmbedBuilder()
            .setColor('#EC1D1D')
            .setTitle(`👤 Info de ${user.tag}`)
            .addFields(
                { name: 'ID', value: user.id },
                { name: 'Cuenta creada', value: `<t:${parseInt(user.createdTimestamp / 1000)}:R>` }
            );

        message.channel.send({ embeds: [embed] });
    }

    if (message.content === '!serverinfo') {
        const embed = new EmbedBuilder()
            .setColor('#EC1D1D')
            .setTitle(`🌍 ${message.guild.name}`)
            .addFields(
                { name: 'Miembros', value: `${message.guild.memberCount}` },
                { name: 'ID', value: message.guild.id }
            );

        message.channel.send({ embeds: [embed] });
    }

    if (message.content.startsWith('!say ')) {
        const texto = message.content.slice(5);
        message.delete().catch(() => {});
        message.channel.send(texto);
    }

    if (message.content.startsWith('!embed')) {

    const full = message.content.slice(7).trim();

    if (!full) {
        return message.reply('❌ Escribe algo.');
    }

    const parts = full.split('|');

    const contentText = parts[0].trim();
    const embedText = parts.slice(1).join('|').trim();

    try {
        const { embeds, components } = parseMessage(embedText, message);

        if (!embeds.length && !components.length) {
            return message.reply('❌ Mensaje vacío.');
        }

        message.channel.send({
            content: contentText,
            embeds,
            components
        });

    } catch (err) {
        console.log(err);
        message.reply('❌ Error.');
    }
}
    if (message.content.startsWith('!saveembed')) {

    const args = message.content.slice(10).trim();

    const parts = args.split('|');

    const name = parts[0]?.trim();
    const content = parts.slice(1).join('|').trim();

    if (!name || !content) {
        return message.reply('❌ Usa: !saveembed nombre | embed');
    }

    saveEmbed(name, content);

    message.reply(`✅ Embed guardado como "${name}"`);
    }

if (message.content.startsWith('!loadembed')) {

    const name = message.content.split(' ')[1];

    if (!name) return message.reply('❌ Escribe el nombre');

    const data = JSON.parse(fs.readFileSync('./embeds.json'));

    if (!data[name]) {
        return message.reply('❌ No existe ese embed');
    }

    const { parseMessage } = require('./embedBuilder');

    const { embeds, components } = parseMessage(data[name], message);

    message.channel.send({
        embeds,
        components
    });
}
    
    if (message.content.startsWith('!slap ')) {
        const user = message.mentions.users.first();
        if (!user) return message.reply('⚠️ Menciona a alguien.');
if (user.bot) {
    return message.reply('❌ No puedes advertir bots.');
}

        message.channel.send(`👋 ${message.author} le dio una bofetada a ${user}`);
    }

    // =======================
    // 🔢 CMD-KISS-GLOBAL
    // =======================
    if (message.content.toLowerCase() === '!kissglobal') {
        return message.reply(`🌎 Total de besos globales: **${globalKisses}**`);
    }

    // =======================
    // 🔢 CMD-KISS
    // =======================
    if (message.content.toLowerCase().startsWith('!kiss')) {
        const user = message.mentions.users.first();

        if (!user) return message.reply('🎈 Menciona a alguien para besar...');
        if (user.id === message.author.id) 
        return message.reply('🎈 No puedes besarte a ti mismo... o sí?');

        const key = [message.author.id, user.id].sort().join('-');

        if (!kissCount[key]) kissCount[key] = 0;

        kissCount[key]++;
        globalKisses++;

save();

        const kisses = [
    "https://cdn.discordapp.com/attachments/1488378753418526841/1488384152771366922/B5B17D45-D79B-4EB7-8905-BC7154AACC29.gif",
    "https://cdn.discordapp.com/attachments/1488378753418526841/1488384621350621325/D211C01B-0A89-4163-BEE4-2CFECA56EED0.gif",
    "https://cdn.discordapp.com/attachments/1479954317908643860/1488420417084588177/E29FB6E7-CDD5-45B6-8AEA-4EE32535DF74.gif",
    "https://cdn.discordapp.com/attachments/1381762553901744158/1488420554921869363/B66EEBB2-89A8-4608-9F9D-A866A02009D9.gif",
    "https://cdn.discordapp.com/attachments/1479954317908643860/1488420711327338546/8D5AAE6B-1CAF-4384-BAB8-DD386B2DD864.gif",
    "https://cdn.discordapp.com/attachments/1381762553901744158/1488420825676910672/893B21CF-6CDF-4C5A-9237-21D32B7C1415.gif",
    "https://cdn.discordapp.com/attachments/1381762553901744158/1488426289810640987/m9jo8xx843ie1.gif",
    "https://cdn.discordapp.com/attachments/1381762553901744158/1488426331665465405/B7AB14EB-0405-4CBC-8A0E-5AB55C118EE6.gif",
    "https://cdn.discordapp.com/attachments/1381762553901744158/1488426357007581204/CBDE10A3-6CC6-4466-A4E3-B05504EC98EB.gif",
    "https://cdn.discordapp.com/attachments/1381762553901744158/1488426526490886204/C8E256C9-9E96-40D3-AC7B-1BDE00C4E6BB.gif",
    "https://cdn.discordapp.com/attachments/1381762553901744158/1488426363755954326/B2221EC9-2CF7-4265-BC50-6A53F414A6CD.gif",
    "https://cdn.discordapp.com/attachments/1381762553901744158/1488426393053429811/0A36D9F3-48AC-443D-9173-2F1F01F700B0.gif",
    "https://cdn.discordapp.com/attachments/1381762553901744158/1488426555293302844/862C86A7-77D9-48F9-93A3-9EE7E1CF298C.gif",
    "https://cdn.discordapp.com/attachments/1493100509287153765/1493107762052468756/32E4847D-7560-4C28-AA98-CF270328A3A3.gif?ex=69dfbeb7&is=69de6d37&hm=e90bbe9574b52c11521f1ae1c59ab78ca3e2b09dd5dc94c2466fa723e9e5c107",
    "https://cdn.discordapp.com/attachments/1493100509287153765/1493107762052468756/32E4847D-7560-4C28-AA98-CF270328A3A3.gif?ex=69dfbeb7&is=69de6d37&hm=e90bbe9574b52c11521f1ae1c59ab78ca3e2b09dd5dc94c2466fa723e9e5c107&",
    "https://cdn.discordapp.com/attachments/1493100509287153765/1493107817412956261/9414D8B2-4562-45DA-84E6-D4461502178D.gif?ex=69dfbec4&is=69de6d44&hm=e7c95e4f2b0a50253900e8aa4597c5213ce031f5932cf8cf609076950652cc06&",
    "https://cdn.discordapp.com/attachments/1493100509287153765/1493107856348549120/FCDF797C-80B5-4EE8-AB47-D73CEBC6D754.gif?ex=69dfbecd&is=69de6d4d&hm=6e84b142ca740b08d74e21b828d6e15b84d93226784f7fe500157e97e855cef8&",
    "https://cdn.discordapp.com/attachments/1493100509287153765/1493107869313138720/CDC1EF87-A219-4DCA-BAE3-15570C71D013.gif?ex=69dfbed0&is=69de6d50&hm=da5e47db64c56161c2ee11b1bd7eaf3234a9ef9f05020b5518db0f345228a61e&",
    "https://cdn.discordapp.com/attachments/1493100509287153765/1493107882068283522/8CDCB46F-2607-4372-8223-2F81298AAB36.gif?ex=69dfbed3&is=69de6d53&hm=734ca4e54d5944c394a6162701d4ea5181c97f81ab268c90f23472459fbe5d82&",
    "https://cdn.discordapp.com/attachments/1493100509287153765/1493107894088896543/2C001CC0-0432-44BF-8DA9-00D9E579562C.gif?ex=69dfbed6&is=69de6d56&hm=3b5d40633088b7739232c0f57e15b65ac1607f13b6b533a25b56bd3cccd68cfb&",
    "https://cdn.discordapp.com/attachments/1493100509287153765/1493107899914780722/EF4EFCA1-6FA0-455D-B721-CF6FA975D988.gif?ex=69dfbed7&is=69de6d57&hm=e9f9cbf881572ca18fd858e650c6e9fa25c550cb5d928e42cc07fa17be482c20&",
    "https://cdn.discordapp.com/attachments/1493100509287153765/1493107905468039219/849D9BBA-A01B-48AE-8E74-22B1D4C663F1.gif?ex=69dfbed9&is=69de6d59&hm=2b70bf156098ab5a9287acf73ea833eeebb373dfba48d4de28d99ee1e1418342&",
    "https://cdn.discordapp.com/attachments/1493100509287153765/1493107908328816700/IMG_3678.gif?ex=69dfbed9&is=69de6d59&hm=6e7a81cfe4e082ef0cad70fdf582898ead7ed7151c7053441002fd3dac3fbcf8&",
    "https://cdn.discordapp.com/attachments/1493100509287153765/1493107999047159829/B480EDBD-BA8F-4A19-A5C0-C6E376CB32DF.gif?ex=69dfbeef&is=69de6d6f&hm=0c33c689b5ce1da3eeefc8fa557de0d7efe5f8c224d8784f9a8e9fc39618fc5c&",
    "https://cdn.discordapp.com/attachments/1493100509287153765/1493108098498433044/079DD786-A3FB-4447-9D83-5FB62DB988C7.gif?ex=69dfbf07&is=69de6d87&hm=52029366685de460f2424bf9d9f3c4fa2cf9e15c693f863f3dbea067f6282f60&",
    "https://cdn.discordapp.com/attachments/1493100509287153765/1493108033465749627/3A6138CC-EE07-491F-BEE7-1BED4FA7A420.gif?ex=69dfbef7&is=69de6d77&hm=17ad1dd3e5ebbe0b7176d4a944fbe375188a5e072647fff035780257109c3b29&",
    "https://cdn.discordapp.com/attachments/1493100509287153765/1493108178932600985/C8B98B1D-B68C-4656-8EEB-D7DC8FEE4393.gif?ex=69dfbf1a&is=69de6d9a&hm=f91898d9b21976dd814ff10254005cba618e09fef61a633536e384c659f489f0&",
    "https://cdn.discordapp.com/attachments/1493100509287153765/1493108213569294406/23F3BA8B-F152-4E9F-BD01-08E3C0B621CE.gif?ex=69dfbf22&is=69de6da2&hm=b1376db3f58c4271ec90175c62bef8f74d1a169036e15f4575e82481e9587720&",
    "https://cdn.discordapp.com/attachments/1493100509287153765/1493108254707023984/70CDB186-3260-49BD-B13B-6F28AAD5B726.gif?ex=69dfbf2c&is=69de6dac&hm=7fe65b519e10d16e738f93bfeb0763fa54eeb643a7e6cf1361e071fbc9235ca3&"
];
        const textos = ["besa a", "le roba un beso a", "se acerca y besa a", "besa sin aviso a"];

        const randomGif = kisses [Math.floor(Math.random() * kisses.length)];
        const textoRandom = textos[Math.floor(Math.random() * textos.length)];

        const name1 = message.member?.displayName || message.author.username;
        const member2 = message.guild?.members.cache.get(user.id);
        const name2 = member2 ? member2.displayName : user.username;

        const embed = new EmbedBuilder()
            .setColor('#EC1D1D')
            .setTitle('Un beso en Body High')
            .setDescription(
`${message.author} ${textoRandom} ${user}
*${name1} y ${name2} se han besado ${kissCount[key]} veces.*`
            )
            .setImage(randomGif)
            .setFooter({ text: 'Todos observan...' });

        return message.channel.send({ embeds: [embed] });
    }

// ==========================
// SET LOGS
// ==========================
if (message.content.startsWith('!setlogs')) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
        return message.reply('❌ No tienes permisos.');
    }

    const channel = message.mentions.channels.first();
    if (!channel) return message.reply('⚠️ Menciona un canal.');

    if (!config[message.guild.id]) config[message.guild.id] = {};

    config[message.guild.id].logs = channel.id;

    save()

    message.channel.send(`📜 Canal de logs configurado: ${channel}`);
}

return;

// ==========================
// SET CONFESIONES
// ==========================
if (message.content.startsWith('!setconfesiones')) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
        return message.reply('❌ No tienes permisos.');
    }

    const canal = message.mentions.channels.first();
    if (!canal) return message.reply('⚠️ Menciona un canal.');

    if (!config[message.guild.id]) config[message.guild.id] = {};

    config[message.guild.id].confesiones = canal.id;
fs.writeFileSync('./config.json', JSON.stringify(config, null, 2));
    message.reply(`Canal de confesiones configurado en ${canal}`);
}

return;

    // =======================
    // 🔢 CMD-CONFESAR
    // =======================

if (message.content.startsWith('!confesar ')) {

    const texto = message.content.slice(10).trim();

    if (!texto) return message.reply('Escribe tu confesión.');

    if (confesiones.find(c => c.texto === texto)) {
        return message.reply('⚠️ Esa confesión ya fue enviada.');
    }

    lastConfesionId++;
    const id = lastConfesionId;

    confesiones.push({ id, texto, userId: message.author.id });

    save();

    const serverConfig = config[message.guild.id];

    if (!serverConfig?.logs || !serverConfig?.confesiones) {
        return message.reply('⚠️ Configura primero con !setlogs y !setconfesiones');
    }

    const logChannel = client.channels.cache.get(serverConfig.logs);
    if (!logChannel) return message.reply('❌ Canal inválido.');

    const embed = new EmbedBuilder()
        .setColor('#EC1D1D')
        .setTitle(`Confesión pendiente (#${id})`)
        .setDescription(`"${texto}"`)
        .addFields(
            { name: 'Usuario', value: message.author.tag },
            { name: 'Estado', value: 'En espera' }
        );

    const botones = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId(`approve_${id}`).setLabel('Aprobar').setStyle(ButtonStyle.Success),
        new ButtonBuilder().setCustomId(`deny_${id}`).setLabel('Denegar').setStyle(ButtonStyle.Danger)
    );

    await logChannel.send({ embeds: [embed], components: [botones] });

    message.delete().catch(() => {});
}

});

// =======================
client.login(process.env.TOKEN);

