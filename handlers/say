
module.exports = {
    name: 'say',

    async execute(message, args) {

        const texto = args.join(' ').trim();

        if (!texto) return;

        await message.delete().catch(() => {});

        message.channel.send(texto);

    }
};
