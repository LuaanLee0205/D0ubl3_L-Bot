module.exports = {
	canModifyQueue: (member) => {
		member.voice.channelId === member.guild.me.voice.channelId;
	},
};