const { videoPattern } = require('../utils/pattern');
const { createAudioResource, StreamType } = require('@discordjs/voice');
const { getInfo } = require('ytdl-core');
const youtube = require('youtube-sr');
const ytdl = require('ytdl-core-discord');

class Song {
	constructor({ url, title, duration }) {
		this.url = url;
		this.title = title;
		this.duration = duration;
	}

	static async from(url = '', search = '') {
		const isYoutubeUrl = videoPattern.test(url);
		// const isScUrl = scRegex.test(url);

		let songInfo;

		if (isYoutubeUrl) {
			songInfo = await getInfo(url);

			return new this({
				url: songInfo.videoDetails.video_url,
				title: songInfo.videoDetails.title,
				duration: parseInt(songInfo.videoDetails.lengthSeconds),
			});
		} else {
			const result = await youtube.searchOne(search);

			songInfo = await getInfo(`https://youtube.com/watch?v=${result.id}`);

			return new this({
				url: songInfo.videoDetails.video_url,
				title: songInfo.videoDetails.title,
				duration: parseInt(songInfo.videoDetails.lengthSeconds),
			});
		}
	}

	async makeResource() {
		let stream;

		const type = this.url.includes('youtube.com') ? StreamType.Opus : StreamType.OggOpus;

		const source = this.url.includes('youtube') ? 'youtube' : 'soundcloud';

		if (source === 'youtube') {
			stream = await ytdl(this.url, { highWaterMark: 1 << 25 });
		}

		if (!stream) return;

		return createAudioResource(stream, { metadata: this, inputType: type, inlineVolume: true });
	}

	startMessage() {
		return `🎶 Started playing: **${this.title}** ${this.url}`;
	}
}
module.exports = {
	Song,
};