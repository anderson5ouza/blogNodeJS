const express = require('express');
const ArtigosModel = require('./artigos');
const CategoriasModel = require('../categorias/Categorias');
const slugify = require('slugify');
const router = express.Router();
const autenticar = require('../middlewares/autenticacao');

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

//exclusão de arquivo
const fs = require('fs');


router.get('/admin/artigos', autenticar, (req, res) => {

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
router.get('/admin/artigos/novo', autenticar, (req, res) => {

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
router.get('/admin/artigos/editar/:id?', autenticar, (req, res) => {

    var id = req.params.id ? req.params.id : false;
    
    if(!id || isNaN(id)){
        res.redirect('/admin/artigos');
    }else{

        ArtigosModel.findByPk(id).then(artigo => {

            CategoriasModel.findAll({
                order:[
                    ['title', 'ASC']
                ]
            }).then(categorias =>{
                res.render('admin/artigos/form-edicao', { artigo: artigo, categorias: categorias });
            });

        }).catch(erro => {
            res.redirect('/admin/artigos');
        })
    }

});


//ação de insert no banco de dados
router.post('/admin/artigos/salvar', autenticar, (req, res) => {

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
router.post('/admin/artigo/editar', autenticar, (req, res) => {

    var id          = req.body.id;
    var title       = req.body.title;
    var categoriaId = req.body.categoriaId;
    var description = req.body.description;
    var image_atual = req.body.image_atual;
    var image       = req.body.image ? req.body.image : req.body.image_atual;

    if(isNaN(id) || title == undefined){
        res.redirect('/admin/artigos/editar');
    }else{

        //excluir imagem antiga, caso a imagem seja trocada no formulário editar
        if(image_atual != image){

            const imageAntiga = 'uploads/'+image_atual;

            if(fs.existsSync(imageAntiga)){

                try{
                    fs.unlinkSync(imageAntiga);
                }catch (error){
                    console.log(error);
                }

            }

        }

        ArtigosModel.update({
                title: title,
                slug: slugify(title),
                categoriaId : categoriaId,
                description: description,
                image: image
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
router.get('/admin/artigo/excluir/:id?/:image?', autenticar, (req, res) => {

    let id    = req.params.id ? req.params.id : false;
    let image = req.params.image ? req.params.image : false;

    if(id){

        //excluir a imagem, caso exista
        if(image){

            let foto = './uploads/'+image;

            if(fs.existsSync(foto)){

                try{
                    fs.unlinkSync(foto);
                }catch (error){
                    console.log(error);
                }

            }
        }
           
      
        //exclusão do registro
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
