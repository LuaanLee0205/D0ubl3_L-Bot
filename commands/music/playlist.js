const { joinVoiceChannel } = require('@discordjs/voice');
const { EmbedBuilder } = require('discord.js');
const { Playlist } = require('../../classes/playlist');
const { Queue } = require('../../classes/queue');

module.exports = {
	name: 'playlist',
	category: 'music',
	description: 'Play a playlist from youtube',
	execute: async (client, message, args) => {
		const { channel } = message.member.voice;

		const queue = client.queues.get(message.guild.id);

		if (!args.length) {
			return await message.reply(`Usage: ${client.prefix}playlist <YouTube Playlist URL | Playlist Name>`).catch(console.error);
		}

		if (!channel) return await message.reply('You need to join a voice channel first!').catch(console.error);

		if (queue && channel.id !== queue.connection.joinConfig.channelId) {
			return message
				.reply(`You must be in the same channel as ${message.client.user.username}`)
				.catch(console.error);
		}

		let playlist;

		try {
			playlist = await Playlist.from(args[0], args.join(' '));
		} catch (error) {
			console.error(error);

			return await message.reply('Playlist not found :(').catch(console.error);
		}

		if (queue) {
			queue.songs.push(...playlist.videos);
		} else {
			const newQueue = new Queue({
				message,
				connection: joinVoiceChannel({
					channelId: channel.id,
					guildId: channel.guild.id,
					adapterCreator: channel.guild.voiceAdapterCreator,
				}),
			});

			client.queues.set(message.guild.id, newQueue);
			newQueue.songs.push(...playlist.videos);

			newQueue.enqueue(playlist.videos[0]);
		}

		const playlistEmbed = new EmbedBuilder()
			.setTitle(`${playlist.data.title}`)
			.setDescription(
				playlist.videos.map((song, index) => `${index + 1}. ${song.title}`).join('\n'),
			)
			.setURL(playlist.data.url)
			.setColor('#F8AA2A')
			.setTimestamp();

		if (playlistEmbed.description.length >= 2048) {
			playlistEmbed.description =
                playlistEmbed.description.substr(0, 2007) + '\nPlaylist larger than character limit...';
		}

		message
			.reply({
				content: `<${message.author}> Started a playlist`,
				embeds: [playlistEmbed],
			})
			.catch(console.error);
	},
};
