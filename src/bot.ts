import * as discord from 'discord.js';

const bot = new discord.Client;

bot.on('ready', () => {
	console.log('-----------------------------------------------------------');
	console.log(
		`Logged in as ${bot.user.username}#${
			bot.user.discriminator
		} running version 1.0.0`
	);
	bot.user.setActivity('-/help');
	console.log(`${bot.user.username} is on ${bot.guilds.size} server(s)!`);
	console.log('-----------------------------------------------------------');
});

bot.on('message', message => {
    const sender = message.author;
	if (sender.bot) return;
	if (message.channel.type === 'dm') {
		return message.channel.send('Please use commands in a server!');
	}
    const prefix = 'f!';
    
    const messageArray = message.content.split(' ');

	const msg = messageArray[0];

    const cmd = msg.slice(prefix.length).trim();
    
})