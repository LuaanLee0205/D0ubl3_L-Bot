const { SlashCommandBuilder, ActionRowBuilder, ButtonStyle, ButtonBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder().setName('ping').setDescription('Replies with Pong!'),
	async execute(interaction) {
		const row = new ActionRowBuilder().addComponents(
			new ButtonBuilder()
				.setCustomId('primary')
				.setLabel('Primary')
				.setStyle(ButtonStyle.Primary)
				.setDisabled(true)
		);
		const embed = new EmbedBuilder()
			.setColor(0x0099ff)
			.setTitle('Some title')
			.setURL('https://discord.js.org')
			.setDescription('Some description here');
		await interaction.reply({ content: 'Pong!', components: [row], embeds: [embed] });
		await interaction.followUp('Pong again!');
	},
};
