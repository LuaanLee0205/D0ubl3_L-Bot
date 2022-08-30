const { logger } = require('../../utils/logger');
const { canModifyQueue } = require('../../utils/queue');

module.exports = {
	name: 'resume',
	category: 'music',
	description: 'Resume currently playing music',
	execute: async (client, message, args) => {
		const queue = client.queues.get(message.guild.id);

		if (!queue) return await message.reply('There is nothing playing.').catch(logger.error);
		if (!canModifyQueue(message.member)) return await message.reply('You need to join a voice channel first!');

		if (queue.player.unpause()) {
			return await queue.textChannel
				.send('The queue is not paused.')
				.catch(logger.error);
		}

		return await message.reply('The queue is not paused.').catch(logger.error);
	},
};
