const { SlashCommandBuilder } = require('discord.js');
const db = require('../models');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('addtag')
		.setDescription('save a tag!')
		.addStringOption((option) => option.setName('name').setDescription('The name of tag').setRequired(true))
		.addStringOption((option) => option.setName('description').setDescription('The desc of tag').setRequired(true)),
	async execute(interaction) {
		// get model
		const Tags = db.models.get('Tags');

		const tagName = interaction.options.getString('name');
		const tagDescription = interaction.options.getString('description');

		try {
			// equivalent to: INSERT INTO tags (name, description, username) values (?, ?, ?);
			const tag = await Tags.create({
				name: tagName,
				description: tagDescription,
				username: interaction.user.username,
			});

			await interaction.reply(`Tag ${tag.name} added.`);
		} catch (error) {
			if (error.name === 'SequelizeUniqueConstraintError') {
				await interaction.reply('That tag already exists.');
			}

			await interaction.reply('Something went wrong with adding a tag.');
		}
	},
};
