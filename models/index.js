const fs = require('node:fs');
const path = require('node:path');
const logger = require('pino')();
const Sequelize = require('sequelize');
const sequelize = new Sequelize(process.env.database, process.env.username, process.env.password, {
	host: process.env.host,
	dialect: 'sqlite',
	logging: (msg) => logger.info(msg),
});
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.models = new Map();

// read all model from this folder
const commandFiles = fs.readdirSync(__dirname).filter((file) => file.endsWith('.js') && !file.startsWith('index'));
for (const file of commandFiles) {
	const filePath = path.join(__dirname, file);
	const model = require(filePath)(sequelize, Sequelize);

	db.models.set(file.split('.')[0], model);
}

//  = require('./tutorial.model.js')(sequelize, Sequelize);
module.exports = db;
