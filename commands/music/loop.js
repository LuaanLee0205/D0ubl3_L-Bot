const { logger } = require('../../utils/logger');
const { canModifyQueue } = require('../../utils/queue');

module.exports = {
	name: 'loop',
	category: 'music',
	description: 'Toggle music loop',
	execute: async (client, message, args) => {
		const queue = client.queues.get(message.guild.id);

		if (!queue) return message.reply('There is nothing playing.').catch(logger.error);
		if (!canModifyQueue(message.member)) return message.reply('You need to join a voice channel first!');

		queue.loop = !queue.loop;

		return await message
			.reply(`Loop is now ${queue.loop ? '**on**' : '**off**'}`)
			.catch(logger.error);
	},
};
