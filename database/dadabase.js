const Sequelize = require('sequelize');

const connection = new Sequelize('projeto_blog', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = connection;