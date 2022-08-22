const logger = require('pino')();

module.exports = {
	name: 'interactionCreate',
	once: false,
	async execute(interaction) {
		if (!interaction.isChatInputCommand()) return;
		const { client } = interaction;
		const command = client.commands.get(interaction.commandName);

		if (!command) return;

		try {
			await command.execute(interaction);
			logger.info(`${command.data.name} execute successed`);
		} catch (error) {
			logger.error(`${command.data.name} execute failed`);
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	},
};
