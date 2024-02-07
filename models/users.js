const Sequelize = require('sequelize');

const {sequelize} = require('../util/database');

const Users = sequelize.define('User',{
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    email:{
        type: Sequelize.STRING,
        required: true
    },
    password:{
        type:Sequelize.STRING,
        required: true

    }
},
    {
        tableName: 'users'

});

module.exports = Users;

