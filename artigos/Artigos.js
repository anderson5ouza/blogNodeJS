const Sequelize = require('sequelize');
const connection = require('../database/database');
const CategoriasModel = require('../categorias/Categorias');

const Artigos = connection.define('artigos', {
    title:{
        type: Sequelize.STRING,
        allowNull: false
    },
    slug:{
        type: Sequelize.STRING,
        allowNull: false
    },
    description: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    image:{
        type: Sequelize.STRING,
        allowNull: true
    }
});

//Cria o relacionamento 1 -> muitos
CategoriasModel.hasMany(Artigos);

//cria o relacionamento (belongsTo = Pertence à/ao)
Artigos.belongsTo(CategoriasModel);

//true - comando abaixo deve ser executado apenas 1x, logo após criar os relacionamento, depois remove ou comenta
Artigos.sync({force: false});

module.exports = Artigos;