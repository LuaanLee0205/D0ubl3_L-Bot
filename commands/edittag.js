const { SlashCommandBuilder } = require('discord.js');
const db = require('../models');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('edittag')
		.setDescription('Edit a tag!')
		.addStringOption((option) => option.setName('name').setDescription('The name of tag').setRequired(true))
		.addStringOption((option) => option.setName('description').setDescription('The desc of tag').setRequired(true)),
	async execute(interaction) {
		// get model
		const Tags = db.models.get('Tags');

		const tagName = interaction.options.getString('name');
		const tagDescription = interaction.options.getString('description');

		// equivalent to: UPDATE tags (description) values (?) WHERE name='?';
		const affectedRows = await Tags.update({ description: tagDescription }, { where: { name: tagName } });

		if (affectedRows > 0) {
			return await interaction.reply(`Tag ${tagName} was edited.`);
		}

		return await interaction.reply(`Could not find a tag with name ${tagName}.`);
	},
};
