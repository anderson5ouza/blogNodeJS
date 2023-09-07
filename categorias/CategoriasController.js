const express = require('express');
const router = express.Router();
const CategoriasModel = require('./Categorias');
const slugify = require('slugify');
//const Categorias = require('./categorias');

router.get('/admin/categorias', (req, res) => {
    
    CategoriasModel.findAll({
        raw: true,
        order: [
            ['id', 'DESC']
        ]
    }).then(categorias => {
        res.render('admin/categorias/index', {
            categorias: categorias
        });
    });

});

//tela de cadastro
router.get('/admin/categorias/nova', (req, res) => {
    res.render('admin/categorias/form-cadastro');
});

//tela edição
router.get('/admin/categorias/editar/:id?', (req, res) => {

    var id = req.params.id ? req.params.id : false
    
    if(!id || isNaN(id)){
        res.redirect('/admin/categorias');
    }else{
        
        CategoriasModel.findByPk(id).then(categoria => {
            res.render('admin/categorias/form-edicao', {
                categoria: categoria
            });
        }).catch(erro => {
            res.redirect('/admin/categorias');
        });
    }

});

//ação de insert no banco de dados
router.post('/admin/categorias/salvar', (req, res) => {

    var title = req.body.title;

    if(title == undefined){
        res.redirect('/admin/categorias/nova');
    }else{

        CategoriasModel.create({
            title: title,
            slug: slugify(title)
        }).then(() => {
            res.redirect('/admin/categorias');
        });

    }
});

//ação de update no banco de dados
router.post('/admin/categoria/editar', (req, res) => {
    
    var id = req.body.id;
    var title = req.body.title;

    if(isNaN(id) || title == undefined){
       res.redirect('/admin/categoria/editar');
    }else{

        CategoriasModel.update({title: title},{
            where: {
                id: id
            }
        }).then(() => {
            res.redirect('/admin/categorias');
        });

    }    

});

//ação de delete no banco de dados
router.get('/admin/categoria/excluir/:id?', (req, res) => {

    var id = req.params.id ? req.params.id : false

    if(id){

        CategoriasModel.destroy({
            where:{
                id: id
            }
        }).then(() => {
            res.redirect('/admin/categorias');
        });

    }else{
        res.redirect('/admin/categorias');
    }

});

module.exports = router;

