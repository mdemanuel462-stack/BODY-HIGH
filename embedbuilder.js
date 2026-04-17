const { EmbedBuilder } = require('discord.js');

function applyReplacements(text, message) {
    const replacements = {
        '{user}': message.author.username,
        '{user.tag}': message.author.tag,
        '{user.id}': message.author.id,
        '{server}': message.guild.name,
        '{members}': message.guild.memberCount
    };

    for (const key in replacements) {
        text = text.split(key).join(replacements[key]);
    }

    return text;
}

function parseEmbed(text, message) {
    if (!text) return null;

    text = applyReplacements(text, message);

    const embed = new EmbedBuilder();

    // TITLE
    const title = text.match(/{title:\s*([\s\S]*?)}/i);
    if (title) embed.setTitle(title[1]);

    // DESCRIPTION
    const desc = text.match(/{desc:\s*([\s\S]*?)}/i);
    if (desc) embed.setDescription(desc[1]);

    // COLOR
    const color = text.match(/{color:\s*([^}]+)}/i);
    if (color) embed.setColor(color[1]);

    // FOOTER
    const footer = text.match(/{footer:\s*([\s\S]*?)}/i);
    if (footer) embed.setFooter({ text: footer[1] });

    // IMAGE
    const image = text.match(/{image:\s*([^}]+)}/i);
    if (image) embed.setImage(image[1]);

    // THUMBNAIL
    const thumbnail = text.match(/{thumbnail:\s*([^}]+)}/i);
    if (thumbnail) embed.setThumbnail(thumbnail[1]);

    // AUTHOR
    const author = text.match(/{author:\s*([^|}]+)\s*\|\s*([^}]+)}/i);
    if (author) {
        embed.setAuthor({
            name: author[1].trim(),
            iconURL: author[2].trim()
        });
    }

    // TIMESTAMP
    if (text.includes('{timestamp}')) {
        embed.setTimestamp();
    }

    // FIELDS (MULTIPLES)
    const fieldRegex = /{field:\s*([^|}]+)\s*\|\s*([^|}]+)\s*\|\s*(true|false)}/gi;
    let match;

    while ((match = fieldRegex.exec(text)) !== null) {
        embed.addFields({
            name: match[1].trim(),
            value: match[2].trim(),
            inline: match[3].trim() === 'true'
        });
    }

    return embed;
}

module.exports = { parseEmbed };
