const Sequelize = require('sequelize');
const connection = require('../database/database');
const UsuariosModel = require('../usuarios/Usuarios');

const Usuarios = connection.define('usuarios', {
    nome:{
        type: Sequelize.STRING,
        allowNull: false
    },
    login:{
        type: Sequelize.STRING,
        allowNull: false
    },
    email:{
        type: Sequelize.STRING,
        allowNull: false
    },
    senha:{
        type: Sequelize.STRING,
        allowNull: false
    }
});

//true - comando abaixo deve ser executado apenas 1x, logo após criar os relacionamento, depois remove ou comenta
Usuarios.sync({force: false});

module.exports = Usuarios;
