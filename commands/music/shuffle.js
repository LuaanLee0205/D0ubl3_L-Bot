const { canModifyQueue } = require('../../utils/queue');

module.exports = {
	name: 'shuffle',
	category: 'music',
	description: 'Shuffle queue',
	execute: async (client, message, args) => {
		const queue = client.queues.get(message.guild.id);

		if (!queue) return message.reply('There is no queue.').catch(console.error);

		if (!canModifyQueue(message.member)) return 'You need to join a voice channel first!';

		const songs = queue.songs;

		for (let i = songs.length - 1; i > 1; i--) {
			const j = 1 + Math.floor(Math.random() * i);
			[songs[i], songs[j]] = [songs[j], songs[i]];
		}

		queue.songs = songs;

		queue.textChannel.send(`<${message.author}> 🔀 shuffled the queue`).catch(console.error);
	},
};
