const youtube = require('youtube-sr');
const { Song } = require('./song');

const pattern = /^.*(youtu.be\/|list=)([^#\\&\\?]*).*/i;

class Playlist {
	constructor(playlist) {
		this.data = playlist;

		this.videos = this.data.videos
			.filter((video) => video.title != 'Private video' && video.title != 'Deleted video')
			.slice(0, process.env.MAX_PLAYLIST_SIZE - 1)
			.map((video) => {
				return new Song({
					title: video.title,
					url: `https://youtube.com/watch?v=${video.id}`,
					duration: video.duration / 1000,
				});
			});
	}

	static async from(url = '', search = '') {
		const urlValid = pattern.test(url);
		let playlist;

		if (urlValid) {
			playlist = await youtube.getPlaylist(url);
		} else {
			const result = await youtube.searchOne(search, 'playlist');
			playlist = await youtube.getPlaylist(result.url);
		}

		return new this(playlist);
	}
}

module.exports = {
	Playlist,
};