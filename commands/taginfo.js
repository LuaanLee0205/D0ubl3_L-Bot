const { SlashCommandBuilder } = require('discord.js');
const db = require('../models');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('taginfo')
		.setDescription('Get info a tag!')
		.addStringOption((option) => option.setName('name').setDescription('The name of tag').setRequired(true)),
	async execute(interaction) {
		// get model
		const Tags = db.models.get('Tags');
		const tagName = interaction.options.getString('name');

		// equivalent to: SELECT * FROM tags WHERE name = 'tagName' LIMIT 1;
		const tag = await Tags.findOne({ where: { name: tagName } });

		if (tag) {
			return await interaction.reply(
				`${tagName} was created by ${tag.username} at ${tag.createdAt} and has been used ${tag.usage_count} times.`
			);
		}

		return await interaction.reply(`Could not find tag: ${tagName}`);
	},
};
