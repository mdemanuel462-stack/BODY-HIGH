const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    StringSelectMenuBuilder
} = require('discord.js');

// 🔁 Replacements seguros
function applyReplacements(text, message) {
    const safe = (val) => val ?? '';

    const map = {
        '{user}': safe(message.author?.username),
        '{user.tag}': safe(message.author?.tag),
        '{user.id}': safe(message.author?.id),
        '{user.avatar}': safe(message.author?.displayAvatarURL?.()),
        '{server}': safe(message.guild?.name),
        '{server.icon}': safe(message.guild?.iconURL?.()),
        '{members}': safe(message.guild?.memberCount),
        '{channel}': safe(message.channel?.name)
    };

    for (const key in map) {
        text = text.split(key).join(map[key]);
    }

    return text;
}

// 🔹 Divide embeds
function splitEmbeds(text) {
    return text.split('{newembed}');
}

// 🔹 Extraer bloques seguro
function getBlocks(text, type) {
    const regex = new RegExp(`\\{${type}:([\\s\\S]*?)\\}`, 'gi');
    let match;
    const results = [];

    while ((match = regex.exec(text)) !== null) {
        results.push(match[1].trim());
    }

    return results;
}

// 🎨 Validar color
function isValidColor(color) {
    return /^#?[0-9A-Fa-f]{6}$/.test(color);
}

// 🚀 PARSER PRO
function parseMessage(text, message) {
    if (!text) return { embeds: [], components: [] };

    text = applyReplacements(text, message);

    const embedTexts = splitEmbeds(text);

    const embeds = [];
    const components = [];

    for (const part of embedTexts) {

        const embed = new EmbedBuilder();

        const title = getBlocks(part, 'title')[0];
        const desc = getBlocks(part, 'desc')[0];
        const color = getBlocks(part, 'color')[0];
        const footer = getBlocks(part, 'footer')[0];
        const image = getBlocks(part, 'image')[0];
        const thumb = getBlocks(part, 'thumbnail')[0];
        const author = getBlocks(part, 'author')[0];

        if (title) embed.setTitle(title.substring(0, 256));
        if (desc) embed.setDescription(desc.substring(0, 4096));

        if (color && isValidColor(color)) {
            embed.setColor(color.startsWith('#') ? color : `#${color}`);
        }

        if (footer) embed.setFooter({ text: footer.substring(0, 2048) });
        if (image) embed.setImage(image);
        if (thumb) embed.setThumbnail(thumb);

        if (author) {
            const p = author.split('|');
            embed.setAuthor({
                name: p[0]?.trim()?.substring(0, 256),
                iconURL: p[1]?.trim() || null
            });
        }

        if (part.includes('{timestamp}')) {
            embed.setTimestamp();
        }

        // 📦 FIELDS (máx 25)
        const fields = getBlocks(part, 'field').slice(0, 25);

        for (const f of fields) {
            const p = f.split('|');

            if (p.length >= 2) {
                embed.addFields({
                    name: p[0].trim().substring(0, 256),
                    value: p[1].trim().substring(0, 1024),
                    inline: p[2]?.trim() === 'true'
                });
            }
        }

        // 🚫 evitar embed vacío
        if (
            embed.data.title ||
            embed.data.description ||
            (embed.data.fields && embed.data.fields.length)
        ) {
            embeds.push(embed);
        }

        // 🔘 BOTONES (máx 5 por fila)
        const buttons = getBlocks(part, 'button').slice(0, 5);

        if (buttons.length) {
            const row = new ActionRowBuilder();

            for (const b of buttons) {
                const p = b.split('|');

                if (!p[0] || !p[1]) continue;

                row.addComponents(
                    new ButtonBuilder()
                        .setCustomId(p[1].trim().substring(0, 100))
                        .setLabel(p[0].trim().substring(0, 80))
                        .setStyle(ButtonStyle.Primary)
                );
            }

            if (row.components.length) components.push(row);
        }

        // 📜 SELECT MENU (máx 25 opciones)
        const menus = getBlocks(part, 'select').slice(0, 25);

        if (menus.length) {
            const row = new ActionRowBuilder();

            const menu = new StringSelectMenuBuilder()
                .setCustomId('menu_' + Date.now())
                .setPlaceholder('Selecciona una opción');

            for (const m of menus) {
                const p = m.split('|');

                if (!p[0] || !p[1]) continue;

                menu.addOptions({
                    label: p[0].trim().substring(0, 100),
                    value: p[1].trim().substring(0, 100)
                });
            }

            row.addComponents(menu);
            components.push(row);
        }
    }

    return { embeds, components };
}

module.exports = { parseMessage };
