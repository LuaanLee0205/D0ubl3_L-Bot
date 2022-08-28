const { logger } = require('../utils/logger');

module.exports = {
	name: 'warn',
	once: false,
	execute(info) {
		logger.info(info);
	},
};
