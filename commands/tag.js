const { SlashCommandBuilder } = require('discord.js');
const db = require('../models');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('tag')
		.setDescription('Get a tag!')
		.addStringOption((option) => option.setName('name').setDescription('The name of tag').setRequired(true)),
	async execute(interaction) {
		// get model
		const Tags = db.models.get('Tags');

		const tagName = interaction.options.getString('name');

		// equivalent to: SELECT * FROM tags WHERE name = 'tagName' LIMIT 1;
		const tag = await Tags.findOne({ where: { name: tagName } });

		if (tag) {
			// equivalent to: UPDATE tags SET usage_count = usage_count + 1 WHERE name = 'tagName';
			tag.increment('usage_count');

			return await interaction.reply(tag.get('description'));
		}

		return await interaction.reply(`Could not find tag: ${tagName}`);
	},
};
