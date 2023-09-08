const express = require('express');
const ArtigosModel = require('./artigos');
const CategoriasModel = require('../categorias/Categorias');
const slugify = require('slugify');
const router = express.Router();

const multer = require('multer');

// Configuração de armazenamento
const multerStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        // Extração da extensão do arquivo original:
        const extensaoArquivo = file.originalname.split('.')[1];

        // Cria um código randômico que será o nome do arquivo
        const novoNomeArquivo = require('crypto').randomBytes(32).toString('hex');

        // Indica o novo nome do arquivo:
        cb(null, `${novoNomeArquivo}.${extensaoArquivo}`);
    }
});

const upload = multer({storage: multerStorage});







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
    var image       = req.body.image;

    if(title == undefined || isNaN(categoriaId)){
        res.redirect('/admin/artigos/novo');
    }else{
        ArtigosModel.create({
            title: title,
            slug: slugify(title),
            description: description,
            image: image,
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

//upload image
router.post('/admin/upload', upload.single('image'), function(req, res){
    
    const filename = req.file.filename;
    res.json({ url: filename });
 
});

module.exports = router;
