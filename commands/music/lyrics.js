const lyricsFinder = require('lyrics-finder');
const { EmbedBuilder } = require('discord.js');
const { logger } = require('../../utils/logger');

module.exports = {
	name: 'lyrics',
	category: 'music',
	description: 'Get lyrics for the currently playing song',
	execute: async (client, message, args) => {
		const queue = client.queues.get(message.guild.id);

		if (!queue || !queue.songs.length) return message.reply('There is nothing playing.').catch(logger.error);

		let lyrics = null;
		const title = queue.songs[0].title;

		try {
			lyrics = await lyricsFinder(queue.songs[0].title, '');
			if (!lyrics) lyrics = `No lyrics found for ${title}.`;
		} catch (error) {
			lyrics = `No lyrics found for ${title}.`;
		}

		const lyricsEmbed = new EmbedBuilder()
			.setTitle(`${title} - Lyrics`)
			.setDescription(lyrics)
			.setColor('#F8AA2A')
			.setTimestamp();

		if (lyricsEmbed.data.description.length >= 2048) { lyricsEmbed.data.description = `${lyricsEmbed.data.description.substr(0, 2045)}...`; }

		return message.reply({ embeds: [lyricsEmbed] }).catch(logger.error);
	},
};
