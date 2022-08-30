const { EmbedBuilder, version } = require('discord.js');
const { logger } = require('../../utils/logger');
const os = require('os');
const moment = require('moment');
require('moment-duration-format');
require('ms');
const cpuStat = require('cpu-stat');

module.exports = {
	name: 'botinfo',
	category: 'utility',
	description: 'Sends detailed info about the client"',
	execute: async (client, message, args) => {
		cpuStat.usagePercent(async function(err, percent, seconds) {
			if (err) {
				return logger.error(err);
			}
			const duration = moment.duration(client.uptime).format(' D [days], H [hrs], m [mins], s [secs]');
			const botinfo = new EmbedBuilder()
				.setAuthor({
					iconURL: client.user.displayAvatarURL(),
					name: client.user.username,
				})
				.setTitle('__**Stats:**__')
				.setColor('#F8AA2A')
				.addFields(
					{ name: '⏳ Mem Usage', value: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} / ${(os.totalmem() / 1024 / 1024).toFixed(2)} MB`, inline: true },
					{ name: '⌚️ Uptime ', value: `${duration}`, inline: true },
					{ name: '📁 Users', value: `${client.users.cache.size}`, inline: true },
					{ name: '📁 Servers', value: `${client.guilds.cache.size}`, inline: true },
					{ name: '📁 Channels ', value: `${client.channels.cache.size}`, inline: true },
					{ name: '👾 Discord.js', value: `v${version}`, inline: true },
					{ name: '🤖 Node', value: `${process.version}`, inline: true },
					{ name: '🤖 CPU', value: `\`\`\`md\n${os.cpus().map(i => `${i.model}`)[0]}\`\`\`` },
					{ name: '🤖 CPU usage', value: `\`${percent.toFixed(2)}%\``, inline: true },
					{ name: '🤖 Arch', value: `\`${os.arch()}\``, inline: true },
					{ name: '💻 Platform', value: `\`\`${os.platform()}\`\``, inline: true },
					{ name: 'API Latency', value: `${(client.ws.ping)}ms` },
				);
			await message.reply({ embeds: [botinfo] });
		});
	},
};
