const Sequelize = require('sequelize');

const {sequelize} = require('../util/database');

const Review = sequelize.define('review',{
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        alowNull: false,
        primaryKey: true
    },
    name: Sequelize.STRING,
    movie:{
        type: Sequelize.STRING,
        alowNull: false

    },
    review: Sequelize.STRING,
    rating: Sequelize.INTEGER,
    date:Sequelize.STRING,
    imageUrl: {
        type:Sequelize.STRING

    },


});

module.exports = Review;
