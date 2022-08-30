const { Song } = require('../../classes/song');
const { Queue } = require('../../classes/queue');
const { playlistPattern } = require('../../utils/pattern');
const { joinVoiceChannel } = require('@discordjs/voice');
const { logger } = require('../../utils/logger');

module.exports = {
	name: 'play',
	category: 'music',
	description: 'Plays audio from YouTube or Soundcloud',
	execute: async (client, message, args) => {
		const { channel } = message.member.voice;
		if (!channel) return await message.reply('Please join to a voice channel first');

		const queue = client.queues.get(message.guild.id);

		if (queue && channel.id !== queue.connection.joinConfig.channelId) {
			return await message
				.reply(`You must be in the same channel as ${client.user.username}`)
				.catch(logger.error);
		}

		if (!args.length) return await message.reply(`Usage: ${client.prefix}play <YouTube URL | Video Name | Soundcloud URL>`).catch(logger.error);

		const url = args[0];

		const loadingReply = await message.reply('⏳ Loading...');

		// Start the playlist if playlist url was provided
		if (playlistPattern.test(args[0])) {
			await loadingReply.delete();
			return client.commands.get('playlist').execute(message, args);
		}

		let song;

		try {
			song = await Song.from(url, args.join(' '));
		} catch (error) {
			logger.error(error);
			return await message.reply('There was an error executing that command.').catch(logger.error);
		} finally {
			await loadingReply.delete();
		}

		if (queue) {
			queue.songs.push(song);

			return await message
				.reply(`✅ **${song.title}** has been added to the queue by <@${message.author}>`)
				.catch(logger.error);
		}

		const newQueue = new Queue({
			message,
			connection: joinVoiceChannel({
				channelId: channel.id,
				guildId: channel.guild.id,
				adapterCreator: channel.guild.voiceAdapterCreator,
			}),
		});

		client.queues.set(message.guild.id, newQueue);

		newQueue.enqueue(song);
	},
};
