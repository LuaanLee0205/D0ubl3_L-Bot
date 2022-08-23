module.exports = (sequelize, Sequelize) => {
	const { DataTypes } = Sequelize;
	const Tags = sequelize.define('tags', {
		name: {
			type: DataTypes.STRING,
			unique: true,
		},
		description: DataTypes.TEXT,
		username: Sequelize.STRING,
		usage_count: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
			allowNull: false,
		},
	});
	return Tags;
};
