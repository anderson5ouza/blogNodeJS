const express = require('express');
const router = express.Router();
const CategoriasModel = require('./categorias');
const slugify = require('slugify');

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

router.get('/admin/categorias/nova', (req, res) => {
    res.render('admin/categorias/form-cadastro');
});


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

module.exports = router;

