const Sequelize = require('sequelize');
const connection = require('../database/database');

const Categorias = connection.define('categorias', {
    title:{
        type: Sequelize.STRING,
        allowNull: false
    }, 
    slug: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

//true - comando abaixo deve ser executado apenas 1x, logo após criar os relacionamento, depois remove ou comenta
Categorias.sync({force: false});

module.exports = Categorias;