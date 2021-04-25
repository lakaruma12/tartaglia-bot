module.exports = async function (msg) {
    client.on('message', (message) => {
        if (message.author.bot) return;
        console.log(`[${message.author.tag}]: ${message.content}`);
        if (message.content === 'Good evening') {
            message.reply('Ur not scared of the dark dont you? good evening!')
        }
    });
}