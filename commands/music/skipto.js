const { canModifyQueue } = require('../../utils/queue');

module.exports = {
	name: 'skipto',
	category: 'music',
	description: 'Skip to the selected queue number',
	execute: async (client, message, args) => {
		if (!args.length || isNaN(args[0])) {
			return message
				.reply(`Usage: ${client.prefix}${module.exports.name} <Queue Number>`)
				.catch(console.error);
		}

		const queue = client.queues.get(message.guild.id);

		if (!queue) return message.reply('There is no queue.').catch(console.error);

		if (!canModifyQueue(message.member)) return 'You need to join a voice channel first!';

		if (args[0] > queue.songs.length) {
			return message
				.reply(`The queue is only ${queue.songs.length} songs long!`)
				.catch(console.error);
		}

		if (queue.loop) {
			for (let i = 0; i < args[0] - 2; i++) {
				queue.songs.push(queue.songs.shift());
			}
		} else {
			queue.songs = queue.songs.slice(args[0] - 2);
		}

		queue.player.stop();

		queue.textChannel
			.send(`<${message.author}> ⏭ skipped ${args[0] - 1} songs`)
			.catch(console.error);
	},
};
