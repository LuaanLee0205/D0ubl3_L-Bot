const { canModifyQueue } = require('../../utils/queue');

module.exports = {
	name: 'skip',
	category: 'music',
	description: 'Skip the currently playing song',
	execute: async (client, message, args) => {
		const queue = client.queues.get(message.guild.id);

		if (!queue) return await message.reply('There is nothing playing that I could skip for you.').catch(console.error);

		if (!canModifyQueue(message.member)) return await message.reply('You need to join a voice channel first!');

		queue.player.stop(true);

		return await queue.textChannel.send(`<${message.author}> ⏭ skipped the song`).catch(console.error);
	},
};
