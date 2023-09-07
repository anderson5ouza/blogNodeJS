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

//comando abaixo deve ser executado apenas 1x, logo após criar os relacionamento, depois remove ou comenta
//Categorias.sync({force: true});

module.exports = Categorias;