const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('echo')
		.setDescription('Replies with your input!')
		.addStringOption((option) =>
			option.setName('input').setDescription('The input to echo back').setRequired(true)
		),
	// .addStringOption(option =>
	//     option.setName('category')
	//         .setDescription('The gif category')
	//         .setRequired(true)
	//         .addChoices(
	//             { name: 'Funny', value: 'gif_funny' },
	//             { name: 'Meme', value: 'gif_meme' },
	//             { name: 'Movie', value: 'gif_movie' },
	//         ));
	// .addSubcommand(subcommand =>
	//     subcommand
	//         .setName('user')
	//         .setDescription('Info about a user')
	//         .addUserOption(option => option.setName('target').setDescription('The user')))
	async execute(interaction) {
		// parse option
		// interaction.options.getSubcommand() === 'user'
		const string = interaction.options.getString('input');
		await interaction.reply(`echo: ${string}`);
	},
};
