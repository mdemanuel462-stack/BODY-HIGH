const { EmbedBuilder } = require('discord.js');

function parseMessage(options = {}) {
    const embed = new EmbedBuilder();

    if (options.title) embed.setTitle(options.title);
    if (options.description) embed.setDescription(options.description);
    if (options.color) embed.setColor(options.color);
    if (options.footer) embed.setFooter({ text: options.footer });
    if (options.image) embed.setImage(options.image);
    if (options.thumbnail) embed.setThumbnail(options.thumbnail);
    if (options.author) embed.setAuthor({ name: options.author });

    embed.setTimestamp();

    return embed;
}

module.exports = { parseMessage };
