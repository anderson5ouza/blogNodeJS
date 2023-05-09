const express = require('express');
const ArtigosModel = require('./artigos');
const CategoriasModel = require('../categorias/Categorias');
const slugify = require('slugify');
const router = express.Router();


router.get('/artigos', (req, res) => {
    res.send('ROTA DE ARTIGOS');
});

//tela de cadastro
router.get('/admin/artigos/novo', (req, res) => {

    CategoriasModel.findAll({
        raw: true,
        order: [
            ['title', 'ASC']
        ]
    }).then(categorias => {
        res.render('admin/artigos/form-cadastro', {
            categorias: categorias
        });
    });
});

//ação de insert no banco de dados
router.post('/admin/artigos/salvar', (req, res) => {

    var title       = req.body.title;
    var categoriaId = req.body.categoriaId;
    var description = req.body.description;

    if(title == undefined || isNaN(categoriaId)){
        res.redirect('/admin/artigos/novo');
    }else{
        ArtigosModel.create({
            title: title,
            slug: slugify(title),
            description: description,
            categoriaId: categoriaId
        }).then(() => {
            res.send('cadastrado. Ainda não tem tela de listagem!');
        });
    }

});

module.exports = router;