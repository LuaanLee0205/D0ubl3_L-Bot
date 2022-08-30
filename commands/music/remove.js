const pattern = /^[0-9]{1,2}(\s*,\s*[0-9]{1,2})*$/;
const { canModifyQueue } = require('../../utils/queue');

module.exports = {
	name: 'rm',
	category: 'music',
	description: 'Remove song from the queue',
	execute: async (client, message, args) => {
		const queue = client.queues.get(message.guild.id);

		if (!queue) return await message.reply('There is no queue.').catch(console.error);

		if (!canModifyQueue(message.member)) return 'You need to join a voice channel first!';

		if (!args.length) return message.reply(`Usage: ${client.prefix}remove <Queue Number>`);

		const removeArgs = args.join('');

		const songs = removeArgs.split(',').map((arg) => parseInt(arg));

		const removed = [];

		if (pattern.test(removeArgs)) {
			queue.songs = queue.songs.filter((item, index) => {
				if (songs.find((songIndex) => songIndex - 1 === index)) removed.push(item);
				else return true;
			});

			queue.textChannel.send(
				`<${message.author.id}> ❌ removed **${removed.map((song) => song.title).join('\n')}** from the queue.`);
		} else if (!isNaN(args[0]) && args[0] >= 1 && args[0] <= queue.songs.length) {
			return queue.textChannel.send(
				`<${message.author.id}> ❌ removed **${queue.songs.splice(args[0] - 1, 1)[0].title}** from the queue.`,
			);
		} else {
			return message.reply(`Usage: ${client.prefix}remove <Queue Number>`);
		}
	},
};
