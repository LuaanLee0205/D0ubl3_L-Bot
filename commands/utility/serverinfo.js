const { EmbedBuilder } = require('discord.js');

module.exports = {
	name: 'serverinfo',
	category: 'utility',
	description: 'Shows info about a server',
	execute: async (client, message, args) => {
		const servericon = message.guild.iconURL();
		const owner = await message.guild.fetchOwner();
		const serverembed = new EmbedBuilder()
			.setTitle('Server Information')
			.setColor('#F8AA2A')
			.setThumbnail(servericon)
			.setTimestamp()
			.setFooter({
				text: message.author.username,
				iconURL: message.author.avatarURL(),
			})
			.addFields(
				{ name: 'Server Name', value: `${message.guild.name}` },
				{ name: 'Owner', value: `${owner.user.username}#${owner.user.discriminator}`, inline: true },
				{ name: 'Channels', value: `${message.guild.channels.cache.size}`, inline: true },
				{ name: 'Roles', value: `${message.guild.roles.cache.size}`, inline: true },
				{ name: 'Created On', value: `${message.guild.createdAt}` },
				{ name: 'You Joined', value: `${message.member.joinedAt}` },
				{ name: 'Total Members', value: `${message.guild.memberCount}` },
			);
		await message.reply({ embeds: [serverembed] });
	},
};
