const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.DB_NAME || 'movie_review2', process.env.DB_USER || 'root', process.env.DB_PASSWORD || 'password', {
    dialect: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    logging: false, // Enable logging in development, disable in production
});

module.exports.sequelize = sequelize;

