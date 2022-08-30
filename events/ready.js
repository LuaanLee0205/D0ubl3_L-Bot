const { logger } = require('../utils/logger');

module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		logger.info('---------- START ----------');
		logger.info(`Ready! Logged in as ${client.user.tag}`);
		const activities = ['Vài câu nói', 'có khiến người thay đổi', 'có khiến bờ môi ấm êm', 'giờ chỉ còn trong nỗi nhớ'];
		let i = 0;
		setInterval(() => client.user.setActivity(`${activities[i++ % activities.length]}`, { type: 2 }), 5000);
		client.user.setPresence({ activities: [{ name: 'Vì anh đâu có biết', type: 2 }], status: 'dnd' });
	},
};
