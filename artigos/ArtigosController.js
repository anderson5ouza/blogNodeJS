const express = require('express');
const ArtigosModel = require('./artigos');
const CategoriasModel = require('../categorias/Categorias');
const slugify = require('slugify');
const router = express.Router();

router.get('/admin/artigos', (req, res) => {

    ArtigosModel.findAll({
        include: [
            {model: CategoriasModel}
        ],
        order:  [
            ['id', 'DESC']
        ]
    }).then(artigos => {
        res.render('admin/artigos/index', {
            artigos: artigos
        });
    });

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

//tela edição
router.get('/admin/artigos/editar/:id?', (req, res) => {

    var id = req.params.id ? req.params.id : false;
    
    if(!id || isNaN(id)){
        res.redirect('/admin/artigos');
    }else{

        ArtigosModel.findByPk(id,{
            include: [
                {model: CategoriasModel}
            ]
        }).then(artigo => {

            res.render('admin/artigos/form-edicao', {
                artigo: artigo
            });

        }).catch(erro => {
            res.redirect('/admin/artigos');
        })
    }

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
            res.redirect('/admin/artigos');
        });
    }

});

//ação de update no banco de dados
router.post('/admin/artigo/editar', (req, res) => {

    var id          = req.body.id;
    var title       = req.body.title;
    var categoriaId = req.body.categoriaId;
    var description = req.body.description;

    if(isNaN(id) || title == undefined){
        res.redirect('/admin/artigos/editar');
    }else{

        ArtigosModel.update({
                title: title,
                categoriaId : categoriaId,
                description: description
            },{
                where: {
                    id: id
            }
        }).then(() => {
            res.redirect('/admin/artigos');
        });

    }

});

//ação de delete no banco de dados
router.get('/admin/artigo/excluir/:id?', (req, res) => {

    var id = req.params.id ? req.params.id : false;

    if(id){
        ArtigosModel.destroy({
            where:{
                id: id
            }
        }).then(() => {
            res.redirect('/admin/artigos');
        });
    }else{
        res.redirect('/admin/artigos');
    }

});

module.exports = router;