const { canModifyQueue } = require('../../utils/queue');

module.exports = {
	name: 'skip',
	category: 'music',
	description: 'Skip the currently playing song',
	execute: async (client, message, args) => {
		const queue = client.queues.get(message.guild.id);

		if (!queue) return message.reply('There is nothing playing that I could skip for you.').catch(console.error);

		if (!canModifyQueue(message.member)) return message.reply('You need to join a voice channel first!');

		queue.player.stop(true);

		queue.textChannel.send(`<${message.author}> ⏭ skipped the song`).catch(console.error);
	},
};
