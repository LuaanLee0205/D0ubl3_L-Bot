const { logger } = require('../utils/logger');

module.exports = {
	name: 'error',
	once: false,
	execute(info) {
		logger.error(info);
	},
};
