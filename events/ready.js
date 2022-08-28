const { logger } = require('../utils/logger');

module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		logger.info('---------- START ----------');
		logger.info(`Ready! Logged in as ${client.user.tag}`);
		client.user.setPresence({ activities: [{ name: 'Vì anh đâu có biết', type: 2 }], status: 'dnd' });
	},
};
