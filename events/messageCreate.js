module.exports = {
	name: 'messageCreate',
	once: false,
	async execute(message) {
		const prefix = process.env.PREFIX;
		const { client } = message;

		if (message.author.bot) return;
		if (!message.guild) return;
		if (!message.content.startsWith(prefix)) return;
		if (!message.member) message.member = await message.guild.fetchMember(message);

		const args = message.content.slice(prefix.length).trim().split(/ +/g);
		const cmd = args.shift().toLowerCase();

		if (cmd.length === 0) return;

		const command = client.commands.get(cmd);
		if (!command) message.reply('Invalid command or we do not support');
		command.execute(client, message, args);
	},
};
