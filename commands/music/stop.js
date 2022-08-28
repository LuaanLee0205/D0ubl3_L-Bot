const { canModifyQueue } = require('../../utils/queue');

module.exports = {
	name: 'stop',
	category: 'music',
	description: 'Stops the music',
	execute: async (client, message, args) => {
		const queue = client.queues.get(message.guild.id);

		if (!queue) return message.reply('There is nothing playing.').catch(console.error);
		if (!canModifyQueue(message.member)) return message.reply('You need to join a voice channel first!');

		queue.stop();

		queue.textChannel.send(`<${message.author}> ⏹ stopped the music!`).catch(console.error);
	},
};
