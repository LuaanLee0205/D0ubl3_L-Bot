const { EmbedBuilder } = require('discord.js');

module.exports = {
	name: 'whois',
	category: 'utility',
	description: 'Get information about a user',
	execute: async (client, message, args) => {
		const user = message.mentions.members.first();
		if (!user) { return message.reply('Please mention the user who you want info about.'); }

		const playing = ('[ ' + user.guild.presences.cache.get(user.id).activities + ' ]');

		const whothefuq = new EmbedBuilder()
			.setTitle('User Info:')
			.addFields(
				{ name: 'Full Username', value: `${user.user.tag}` },
				{ name: 'ID', value: `${user.id}` },
				{ name: 'Playing', value: `${playing}`, inline: true },
				{ name: 'Status', value: `${user.guild.presences.cache.get(user.id).status}`, inline: true },
				{ name: 'Joined Discord At', value: `${user.user.createdAt}` },
			)
			.setColor('#F8AA2A')
			.setTimestamp()
			.setThumbnail(user.avatarURL());
		await message.reply({ embeds: [whothefuq] });
	},
};
