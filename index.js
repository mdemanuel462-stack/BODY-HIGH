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

    if (message.content.startsWith('!embed ')) {
        const texto = message.content.slice(7);

        const embed = new EmbedBuilder()
            .setColor('#EC1D1D')
            .setDescription(texto);

        message.channel.send({ embeds: [embed] });
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

        const kisses = [            "https://cdn.discordapp.com/attachments/1488378753418526841/1488383953898438676/07B05C76-2CB3-40DB-9AF2-AA961A2263B9.gif",
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
             “https://cdn.discordapp.com/attachments/1493100509287153765/1493107737993941133/9F0DC230-087E-4A8E-8041-58EFC602263F.gif?ex=69dfbeb1&is=69de6d31&hm=c95c7c7b42326a7462962d5be547778df4857d571d24feb5fc30abcd57d0cbab&”,
“https://cdn.discordapp.com/attachments/1493100509287153765/1493107762052468756/32E4847D-7560-4C28-AA98-CF270328A3A3.gif?ex=69dfbeb7&is=69de6d37&hm=e90bbe9574b52c11521f1ae1c59ab78ca3e2b09dd5dc94c2466fa723e9e5c107&”,
“https://cdn.discordapp.com/attachments/1493100509287153765/1493107817412956261/9414D8B2-4562-45DA-84E6-D4461502178D.gif?ex=69dfbec4&is=69de6d44&hm=e7c95e4f2b0a50253900e8aa4597c5213ce031f5932cf8cf609076950652cc06&”,
“https://cdn.discordapp.com/attachments/1493100509287153765/1493107856348549120/FCDF797C-80B5-4EE8-AB47-D73CEBC6D754.gif?ex=69dfbecd&is=69de6d4d&hm=6e84b142ca740b08d74e21b828d6e15b84d93226784f7fe500157e97e855cef8&”,
“https://cdn.discordapp.com/attachments/1493100509287153765/1493107869313138720/CDC1EF87-A219-4DCA-BAE3-15570C71D013.gif?ex=69dfbed0&is=69de6d50&hm=da5e47db64c56161c2ee11b1bd7eaf3234a9ef9f05020b5518db0f345228a61e&”,
”https://cdn.discordapp.com/attachments/1493100509287153765/1493107882068283522/8CDCB46F-2607-4372-8223-2F81298AAB36.gif?ex=69dfbed3&is=69de6d53&hm=734ca4e54d5944c394a6162701d4ea5181c97f81ab268c90f23472459fbe5d82&”,
“https://cdn.discordapp.com/attachments/1493100509287153765/1493107894088896543/2C001CC0-0432-44BF-8DA9-00D9E579562C.gif?ex=69dfbed6&is=69de6d56&hm=3b5d40633088b7739232c0f57e15b65ac1607f13b6b533a25b56bd3cccd68cfb&”,
“https://cdn.discordapp.com/attachments/1493100509287153765/1493107899914780722/EF4EFCA1-6FA0-455D-B721-CF6FA975D988.gif?ex=69dfbed7&is=69de6d57&hm=e9f9cbf881572ca18fd858e650c6e9fa25c550cb5d928e42cc07fa17be482c20&”,
“https://cdn.discordapp.com/attachments/1493100509287153765/1493107905468039219/849D9BBA-A01B-48AE-8E74-22B1D4C663F1.gif?ex=69dfbed9&is=69de6d59&hm=2b70bf156098ab5a9287acf73ea833eeebb373dfba48d4de28d99ee1e1418342&”,
“https://cdn.discordapp.com/attachments/1493100509287153765/1493107908328816700/IMG_3678.gif?ex=69dfbed9&is=69de6d59&hm=6e7a81cfe4e082ef0cad70fdf582898ead7ed7151c7053441002fd3dac3fbcf8&”,
“https://cdn.discordapp.com/attachments/1493100509287153765/1493107999047159829/B480EDBD-BA8F-4A19-A5C0-C6E376CB32DF.gif?ex=69dfbeef&is=69de6d6f&hm=0c33c689b5ce1da3eeefc8fa557de0d7efe5f8c224d8784f9a8e9fc39618fc5c&”,
“https://cdn.discordapp.com/attachments/1493100509287153765/1493108098498433044/079DD786-A3FB-4447-9D83-5FB62DB988C7.gif?ex=69dfbf07&is=69de6d87&hm=52029366685de460f2424bf9d9f3c4fa2cf9e15c693f863f3dbea067f6282f60&”,
“https://cdn.discordapp.com/attachments/1493100509287153765/1493108033465749627/3A6138CC-EE07-491F-BEE7-1BED4FA7A420.gif?ex=69dfbef7&is=69de6d77&hm=17ad1dd3e5ebbe0b7176d4a944fbe375188a5e072647fff035780257109c3b29&”,
“https://cdn.discordapp.com/attachments/1493100509287153765/1493108178932600985/C8B98B1D-B68C-4656-8EEB-D7DC8FEE4393.gif?ex=69dfbf1a&is=69de6d9a&hm=f91898d9b21976dd814ff10254005cba618e09fef61a633536e384c659f489f0&”,
“https://cdn.discordapp.com/attachments/1493100509287153765/1493108213569294406/23F3BA8B-F152-4E9F-BD01-08E3C0B621CE.gif?ex=69dfbf22&is=69de6da2&hm=b1376db3f58c4271ec90175c62bef8f74d1a169036e15f4575e82481e9587720&”,
“https://cdn.discordapp.com/attachments/1493100509287153765/1493108254707023984/70CDB186-3260-49BD-B13B-6F28AAD5B726.gif?ex=69dfbf2c&is=69de6dac&hm=7fe65b519e10d16e738f93bfeb0763fa54eeb643a7e6cf1361e071fbc9235ca3&”,
“https://cdn.discordapp.com/attachments/1493100509287153765/1493109062873776148/IMG_3686.jpg?ex=69dfbfed&is=69de6e6d&hm=b6a7092297dbe95f6d64bc1eedb15380326b90a0d474c3a3c499c20c7a5fe248&”,
“https://cdn.discordapp.com/attachments/1493100509287153765/1493109081660063834/F244731D-2CB6-4041-ADDC-93416272C4CE.gif?ex=69dfbff1&is=69de6e71&hm=fa8ef660c0d24a1e6c93c465ee08f7fc294ce665f8861a2bbb6e874c9862092d&”,
“https://cdn.discordapp.com/attachments/1493100509287153765/1493109112148590732/E8A588B4-791F-4342-97C6-4F2DFB951EDD.gif?ex=69dfbff8&is=69de6e78&hm=82327328912c0905b6e3dcf69f2113b1cecdd2234744f9ac9669cd5cea507c31&”,
“https://cdn.discordapp.com/attachments/1493100509287153765/1493109127818252448/89FB73FB-CD38-448A-ADE2-4B1A0D611F47.gif?ex=69dfbffc&is=69de6e7c&hm=1b2633ba5987aaf7e5f1070d48dde1c66478f5a72553ae02ff950645149ff34e&”,
“https://cdn.discordapp.com/attachments/1493100509287153765/1493109307523203212/A36CF9A7-F9C2-40C0-8407-BB2845081FE9.gif?ex=69dfc027&is=69de6ea7&hm=3c9c6b7614705266201bad1bddc62bcd31c146a2756a5dbb2bc0f3198b9df184&”,
“https://cdn.discordapp.com/attachments/1493100509287153765/1493109176577167470/5984E605-3967-43DE-BD7C-39F6801A021E.gif?ex=69dfc008&is=69de6e88&hm=aa0aa5631e37b630d72c91c859fb71a37ce01f4b7b5c87c07eb1b12cac5332a3&”,
“https://cdn.discordapp.com/attachments/1493100509287153765/1493109318080401478/CC6844DD-5ACF-462D-B37E-BF041125A619.gif?ex=69dfc02a&is=69de6eaa&hm=9ed1c122b2542046673ee2de60ed79158ee78580f96327a82b85d7cff2cb45c9&”,
“https://cdn.discordapp.com/attachments/1493100509287153765/1493109469071278250/29A6B5A0-7FA0-498A-B9FE-62FCF91F0B4A.gif?ex=69dfc04e&is=69de6ece&hm=e95763dc0e52635843e97328cd8d2742e5baff8ab55e7edaf3d88f56c90a4e1b&”,
“https://cdn.discordapp.com/attachments/1493100509287153765/1493109539367817216/C010EA7E-8746-4153-B35C-5ADEF2DB275F.gif?ex=69dfc05e&is=69de6ede&hm=c79f9e122e7f613ad268b5bff78823b7945e1b0bafb613d81cf68c513915fe67&”,
“https://cdn.discordapp.com/attachments/1493100509287153765/1493109571588194333/D452B06E-F873-4153-880B-230CA6B8A910.gif?ex=69dfc066&is=69de6ee6&hm=418a963cb08033c49f0c005f68a761d7cf17a589046e086e77e9dbd6624c4d89&”,
“https://cdn.discordapp.com/attachments/1493100509287153765/1493109580702552144/74510608-7EB1-40F3-8553-66293BA9CC4D.gif?ex=69dfc068&is=69de6ee8&hm=1eb2a4e6cd5a1eac45297de8358c447b5458004f7d67544b00fab4a42fe7b5d9&”,
“https://cdn.discordapp.com/attachments/1493100509287153765/1493109724969701396/098C2AEB-6F57-40B0-B0C1-CB5C0D778813.gif?ex=69dfc08b&is=69de6f0b&hm=7907b90667bea96bd4b8e58263488eebc0b210fb85a265897b4a507e7de0aa99&”,
“https://cdn.discordapp.com/attachments/1493100509287153765/1493109941488062474/8D654099-10E8-4700-8031-392D08963E71.gif?ex=69dfc0be&is=69de6f3e&hm=c57edcbb8cd3536f0f7750bcc89bfb7e6d761dbf843af26de97cca700603693c&”,
“https://cdn.discordapp.com/attachments/1493100509287153765/1493109962615033886/AA496DA7-1166-4F68-8EA7-572E00386C50.gif?ex=69dfc0c3&is=69de6f43&hm=04e3f81e6c8f0da060af57b026733857f0a10e03750f5a3c38c3ce4acc35c4cc&”,
“https://cdn.discordapp.com/attachments/1493100509287153765/1493113388505497690/72FE25E7-2B59-4729-BF7E-516AF298EFA2.gif?ex=69dfc3f4&is=69de7274&hm=112c728c7bb9ef9df765941bdcbd87ee914584e4dd6af817cc0fbfea868c4017&”,
“https://cdn.discordapp.com/attachments/1493100509287153765/1493113425994186843/9E54AA70-8220-4924-9E4B-4C8C09B6C9C6.gif?ex=69dfc3fd&is=69de727d&hm=08b2121f09ec0963656040811f73ab07c555b58bda0e4e0c7ea46410b03d70bd&”,
“https://cdn.discordapp.com/attachments/1493100509287153765/1493113599994892299/6C2F9B14-4775-44C7-9F80-704C01F48ECD.gif?ex=69dfc426&is=69de72a6&hm=4ea8127de8877c342fa1cc528c394839e0c155afd532251cfdc30a8b2ab99622&”,
“https://cdn.discordapp.com/attachments/1493100509287153765/1493113700125642832/61BE1ADA-B59A-427C-B60D-B154C0A02F4F.gif?ex=69dfc43e&is=69de72be&hm=d38db5493666adba6afb2d0d50d3ff61a31b6c0cfcebdc7f9db5f71ebd359625&”,
“https://cdn.discordapp.com/attachments/1493100509287153765/1493122743678406806/A7D3DE70-0D1D-4FCD-90E7-345079DF8ABE.gif?ex=69dfccaa&is=69de7b2a&hm=df5b57c2a5da26f161f5d2609a9884ef74da7b9c667a185b2f81465e2c5ee7e7&”,
“https://cdn.discordapp.com/attachments/1493100509287153765/1493122778704904284/78142187-007B-40BA-9409-8E670A15C7B8.gif?ex=69dfccb3&is=69de7b33&hm=fd400ed4522f3bfdad41b314cf45c14a14256b2a4649021d9e0b05f39ebcb3c8&”,
“https://cdn.discordapp.com/attachments/1493100509287153765/1493122847160139817/78D2F47D-684F-44EE-A74E-9AE21E0551AB.gif?ex=69dfccc3&is=69de7b43&hm=21309a76f3c23851c7e5b3d7487a4df385787c948896194fa0b5e1f1c5299eeb&”,
“https://cdn.discordapp.com/attachments/1493100509287153765/1493122858916778014/AF6C7559-ED9F-40DA-9C8A-9E1EBB3E9EAB.gif?ex=69dfccc6&is=69de7b46&hm=d6b481efa4b138baf520c2c672505018c9070b15ea841f57ecbf1daa0a1fb05b&”,
“https://cdn.discordapp.com/attachments/1493100509287153765/1493122885399744625/379D1952-AE20-443C-98B0-185E72C3EF1D.gif?ex=69dfcccc&is=69de7b4c&hm=e1764d4d76b82e4503a97ca5671745f3e60742d45260bc1e5fd12ee241e0a41e&”,
“https://cdn.discordapp.com/attachments/1493100509287153765/1493122899664441435/63E5A27A-5589-4822-B591-E4633F7BBC17.gif?ex=69dfccd0&is=69de7b50&hm=53e37fb498e8b4942227e49ab461f909f677006eb421b98d9df344836341541c&”,
“https://cdn.discordapp.com/attachments/1493100509287153765/1493122918522290377/D7275910-AF20-47E0-BC35-AB18C7D7482F.gif?ex=69dfccd4&is=69de7b54&hm=83405ee37b322ac2e0f4f81a29e8f6ea5383affdaad35d560bc6cb4a8c34ac32&”,
“https://cdn.discordapp.com/attachments/1493100509287153765/1493122927913341079/A6B76EF0-08E5-4DA3-AE43-DA17812F6D8C.gif?ex=69dfccd6&is=69de7b56&hm=c9021f86bb076d67db34f782b07ce5fbd46e45e4d4a5a924de2c5be0c135070e&”           
        ];

        const textos = ["besa a", "le roba un beso a", "se acerca y besa a", "besa sin aviso a"];

        const randomGif = kisses [Math.floor(Math.random() * kisses.length)];
        const textoRandom = textos[Math.floor(Math.random() * textos.length)];

        const name1 = message.member?.displayName || message.author.username;
        const member2 = message.guild?.members.cache.get(user.id);
        const name2 = member2 ? member2.displayName : user.username;

        const embed = new EmbedBuilder()
            .setColor('#EC1D1D')
            .setTitle('🎈 Un beso en Derry...')
            .setDescription(
`${message.author} ${textoRandom} ${user}
*${name1} y ${name2} se han besado ${kissCount[key]} veces.*`
            )
            .setImage(randomGif)
            .setFooter({ text: 'Pennywise observa...' });

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

