const { SlashCommandBuilder } = require('discord.js');
const db = require('../models');

module.exports = {
	data: new SlashCommandBuilder().setName('showtags').setDescription('Show all tag!'),
	async execute(interaction) {
		// get model
		const Tags = db.models.get('Tags');

		// equivalent to: SELECT name FROM tags;
		const tagList = await Tags.findAll({ attributes: ['name'] });
		const tagString = tagList.map((t) => t.name).join(', ') || 'No tags set.';

		await interaction.reply(`List of tags: ${tagString}`);
	},
};
