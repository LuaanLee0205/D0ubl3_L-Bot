module.exports = {
	name: 'echo',
	category: 'info',
	description: 'Returns latency and API ping',
	execute: async (client, message, args) => {
		await message.reply(`Your message: ${args.join(' ')}`);
	},
};
