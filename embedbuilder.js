const { EmbedBuilder } = require('discord.js');

function parseEmbed(text, message) {
    if (!text) return null;

    // 🔁 Reemplazos tipo Mimu
    const replacements = {
        '{user}': message.author.username,
        '{user.tag}': message.author.tag,
        '{server}': message.guild.name,
        '{members}': message.guild.memberCount
    };

    for (const key in replacements) {
        text = text.split(key).join(replacements[key]);
    }

    const embed = new EmbedBuilder();

    // 🧱 TITLE
    const title = text.match(/{title:\s*([^}]+)}/i);
    if (title) embed.setTitle(title[1]);

    // 🧱 DESCRIPTION
    const desc = text.match(/{desc:\s*([^}]+)}/i);
    if (desc) embed.setDescription(desc[1]);

    // 🎨 COLOR
    const color = text.match(/{color:\s*([^}]+)}/i);
    if (color) embed.setColor(color[1]);

    // 🧾 FOOTER
    const footer = text.match(/{footer:\s*([^}]+)}/i);
    if (footer) embed.setFooter({ text: footer[1] });

    // 🖼️ IMAGE
    const image = text.match(/{image:\s*([^}]+)}/i);
    if (image) embed.setImage(image[1]);

    // 🖼️ THUMBNAIL
    const thumbnail = text.match(/{thumbnail:\s*([^}]+)}/i);
    if (thumbnail) embed.setThumbnail(thumbnail[1]);

    return embed;
}

module.exports = { parseEmbed };
