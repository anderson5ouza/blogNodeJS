const Sequelize = require('sequelize');
const connection = require('../database/dadabase');
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
    }
});

//Cria o relacionamento 1 -> muitos
CategoriasModel.hasMany(Artigos);

//cria o relacionamento (belongsTo = Pertence à/ao)
Artigos.belongsTo(CategoriasModel);

//comando abaixo deve ser executado apenas 1x, logo após criar os relacionamento, depois remove ou comenta
Artigos.sync({force: true});

module.exports = Artigos;