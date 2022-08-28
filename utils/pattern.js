const videoPattern = /^(https?:\/\/)?(www\.)?(m\.|music\.)?(youtube\.com|youtu\.?be)\/.+$/;
const playlistPattern = /^.*(list=)([^#\\&\\?]*).*/;
const scRegex = /^https?:\/\/(soundcloud\.com)\/(.*)$/;
const mobileScRegex = /^https?:\/\/(soundcloud\.app\.goo\.gl)\/(.*)$/;

module.exports = {
	videoPattern,
	playlistPattern,
	scRegex,
	mobileScRegex,
};