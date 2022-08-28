module.exports = {
	canModifyQueue: (member) => {
		return member.voice.channelId == member.guild.members.me.voice.channelId;
	},
};