const { EmbedBuilder } = require('discord.js');

module.exports = {
	name: 'avatar',
	category: 'utility',
	description: 'Gets the avatar of a user or yourself',
	execute: async (client, message, args) => {
		const member = message.mentions.users.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(x => x.user.username.toLowerCase() === args.slice(0).join(' ') || x.user.username === args[0]) || message.member;

		if (!member.user.avatarURL) return await message.channel.send('That user does not have an avatar');

		const avatar = new EmbedBuilder()
			.setTitle(`${member.user.username}'s Avatar`)
			.setColor('#F8AA2A')
			.setImage(member.user.avatarURL())
			.setColor(member.displayHexColor)
			.setImage(member.user.displayAvatarURL({ dynamic: true, size: 2048 }))
			.setURL(member.user.avatarURL());

		await message.reply({ embeds: [avatar] })
			.catch(() => message.channel.send('**Error:** Missing permission `Embed link` '));
	},
};
