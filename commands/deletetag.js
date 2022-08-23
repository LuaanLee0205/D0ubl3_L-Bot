const { SlashCommandBuilder } = require('discord.js');
const db = require('../models');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('deletetag')
		.setDescription('Show all tag!')
		.addStringOption((option) => option.setName('name').setDescription('The name of tag').setRequired(true)),
	async execute(interaction) {
		// get model
		const Tags = db.models.get('Tags');

		const tagName = interaction.options.getString('name');
		// equivalent to: DELETE from tags WHERE name = ?;
		const rowCount = await Tags.destroy({ where: { name: tagName } });

		if (!rowCount) await interaction.reply('That tag doesn\'t exist');

		return interaction.reply('Tag deleted.');
	},
};
