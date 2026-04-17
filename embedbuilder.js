const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    StringSelectMenuBuilder
} = require('discord.js');

// 🔁 Replacements
function applyReplacements(text, message) {
    const map = {
        '{user}': message.author.username,
        '{user.tag}': message.author.tag,
        '{user.id}': message.author.id,
        '{user.avatar}': message.author.displayAvatarURL(),
        '{server}': message.guild.name,
        '{server.icon}': message.guild.iconURL(),
        '{members}': message.guild.memberCount,
        '{channel}': message.channel.name
    };

    for (const key in map) {
        text = text.split(key).join(map[key] ?? '');
    }

    return text;
}

// 🔹 Divide por múltiples embeds
function splitEmbeds(text) {
    return text.split('{newembed}');
}

// 🔹 Extraer bloques
function getBlocks(text, type) {
    const regex = new RegExp(`\\{${type}:([\\s\\S]*?)\\}`, 'gi');
    let match;
    const results = [];

    while ((match = regex.exec(text)) !== null) {
        results.push(match[1].trim());
    }

    return results;
}

// 🔹 PARSE COMPLETO
function parseMessage(text, message) {
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

        if (title) embed.setTitle(title);
        if (desc) embed.setDescription(desc);

        if (color) {
            try { embed.setColor(color); } catch {}
        }

        if (footer) embed.setFooter({ text: footer });
        if (image) embed.setImage(image);
        if (thumb) embed.setThumbnail(thumb);

        if (author) {
            const parts = author.split('|');
            embed.setAuthor({
                name: parts[0]?.trim(),
                iconURL: parts[1]?.trim()
            });
        }

        if (part.includes('{timestamp}')) {
            embed.setTimestamp();
        }

        // FIELDS
        const fields = getBlocks(part, 'field');
        for (const f of fields) {
            const p = f.split('|');
            if (p.length >= 2) {
                embed.addFields({
                    name: p[0].trim(),
                    value: p[1].trim(),
                    inline: p[2]?.trim() === 'true'
                });
            }
        }

        if (embed.data.title || embed.data.description || embed.data.fields?.length) {
            embeds.push(embed);
        }

        // 🔘 BOTONES
        const buttons = getBlocks(part, 'button');
        if (buttons.length > 0) {
            const row = new ActionRowBuilder();

            for (const b of buttons) {
                const p = b.split('|');

                row.addComponents(
                    new ButtonBuilder()
                        .setCustomId(p[1].trim())
                        .setLabel(p[0].trim())
                        .setStyle(ButtonStyle.Primary)
                );
            }

            components.push(row);
        }

        // 📜 SELECT MENU
        const menus = getBlocks(part, 'select');
        if (menus.length > 0) {
            const row = new ActionRowBuilder();

            const menu = new StringSelectMenuBuilder()
                .setCustomId('menu')
                .setPlaceholder('Selecciona una opción');

            for (const m of menus) {
                const p = m.split('|');
                menu.addOptions({
                    label: p[0].trim(),
                    value: p[1].trim()
                });
            }

            row.addComponents(menu);
            components.push(row);
        }
    }

    return { embeds, components };
}

module.exports = { parseMessage };
