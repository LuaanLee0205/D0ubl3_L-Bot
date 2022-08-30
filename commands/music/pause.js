const { logger } = require('../../utils/logger');
const { canModifyQueue } = require('../../utils/queue');

module.exports = {
	name: 'pause',
	category: 'music',
	description: 'Pause the currently playing music',
	execute: async (client, message, args) => {
		const queue = client.queues.get(message.guild.id);

		if (!queue) return await message.reply('There is nothing playing.').catch(logger.error);

		if (!canModifyQueue(message.member)) return await message.reply('You need to join a voice channel first!');

		if (queue.player.pause()) {
			return await queue.textChannel.send(`<${message.author}> ⏸ paused the music.`).catch(logger.error);
		}
	},
};
