const Sequelize = require('sequelize');

const sequelize = new Sequelize ('movie_review2', 'root', 'password',{
    dialect: 'mysql',
    host: 'localhost',
    logging: false 
});


module.exports.sequelize = sequelize;

