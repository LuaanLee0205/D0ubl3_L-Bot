const { EmbedBuilder } = require('discord.js');
const { splitBar } = require('string-progressbar');

module.exports = {
	name: 'np',
	category: 'music',
	description: 'Show now playing song',
	execute: async (client, message, args) => {
		const queue = client.queues.get(message.guild.id);

		if (!queue || !queue.songs.length) { return await message.reply('There is nothing playing.').catch(console.error); }

		const song = queue.songs[0];
		const seek = queue.resource.playbackDuration / 1000;
		const left = song.duration - seek;

		const nowPlaying = new EmbedBuilder()
			.setTitle('Now playing')
			.setDescription(`${song.title}\n${song.url}`)
			.setColor('#F8AA2A');

		if (song.duration > 0) {
			nowPlaying.addFields(
				{
					name: '\u200b', value: new Date(seek * 1000).toISOString().substr(11, 8) +
						'[' +
						splitBar(song.duration == 0 ? seek : song.duration, seek, 20)[0] +
						']' +
						(song.duration == 0 ? ' ◉ LIVE' : new Date(song.duration * 1000).toISOString().substr(11, 8)), inline: false,
				},
			);

			nowPlaying.setFooter({
				text: `Time Remaining: ${new Date(left * 1000).toISOString().substr(11, 8)}`,
			});
		}

		return await message.reply({ embeds: [nowPlaying] });
	},
};
