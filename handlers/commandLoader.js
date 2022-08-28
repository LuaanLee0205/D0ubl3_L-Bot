const { readdirSync } = require('fs');
const { join } = require('path');

module.exports = (client) => {
	const commandsPath = join(process.cwd(), 'commands');
	readdirSync(commandsPath).forEach((dir) => {
		readdirSync(join(commandsPath, dir))
			.filter((file) => file.endsWith('.js'))
			.forEach((file) => {
				const filePath = join(commandsPath, dir, file);
				const command = require(filePath);
				client.commands.set(command.name, command);
			});
	});
};
