const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const connection = require('./database/database');

const categoriasController = require('./categorias/CategoriasController');
const artigosController    = require('./artigos/artigosController');
const usuariosController   = require('./usuarios/UsuariosController');

const CategoriasModel = require('./categorias/Categorias');
const ArtigosModel    = require('./artigos/artigos');
const UsuariosModel   = require('./usuarios/Usuarios');



// Enable CORS
app.use(function(req, res, next){
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.static('uploads'));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


connection.authenticate()
    .then(() => {
        console.log('Conexão estabelecida com o banco de dados!');
    })
    .catch((error) => {
        console.log(error);
    });

//informando as rotas dos controllers
app.use('/', categoriasController);
app.use('/', artigosController);
app.use('/', usuariosController);





//página principal do blog
app.get('/', (req, res) => {
    ArtigosModel.findAll({
        include: [
            {model: CategoriasModel}
        ],
        order: [
            ['id', 'DESC']
        ]
    }).then(artigos => {

        CategoriasModel.findAll({
            order: [
                ['title', 'ASC']
            ]
        }).then(categorias => {
            res.render('index', {categorias: categorias, artigos: artigos})
        });
      
    });
});

//pagina da listagem de artigos de determinada categoria
app.get('/categoria/:slug', (req, res) => {

    var slug = req.params.slug;

    /*----------- busca relacionada ------------*/
    CategoriasModel.findOne({
        where: {
            slug: slug
        },
        include: [
            {model: ArtigosModel} // traz todos os artigos da categoria do slug
        ]
    }).then(categoria => {

        CategoriasModel.findAll({
            order:[
                ['title', 'ASC']
            ]
        }).then(categorias => {
            res.render('index', {categorias: categorias, artigos: categoria.artigos});
        });
        
    }).catch(error => {
        res.redirect('/');
    });



    /*--------------- busca aninhada feita por mim
    //Busca os dados da categoria do slug
    CategoriasModel.findOne({
        where: {
            slug: slug
        }
    }).then(categoria => {

        //busca todos os artigos da categoria específica
        ArtigosModel.findAll({
            where:{
                categoriaId : categoria.id
            }
        }).then(artigos => {

            //Busca todas as categorias para montar o menu superior
            CategoriasModel.findAll({
                order:[
                    ['title', 'ASC']
                ]
            }).then(categorias => {
                res.render('index', {artigos: artigos, categorias: categorias})
            });

        });

    }).catch(erro => {
        res.redirect('/');
    });
    */

});


//pagina de leitura do artigo
app.get('/artigo/:id/:slug', (req, res) => {

    var id   = req.params.id; 
    var slug = req.params.slug;

    ArtigosModel.findOne({
        where: {
            id: id,
            slug: slug
        }
    }).then(artigo => {

        if(artigo != undefined){

            CategoriasModel.findAll({
                order: [
                    ['title', 'ASC']
                ]
            }).then(categorias => {
                res.render('artigo', { categorias: categorias, artigo: artigo });
            });

        }else{
            res.redirect('/');
        }

    }).catch( erro => {
        res.redirect('/');
    });

});

//paginação de artigos
app.get('/artigos/:numero?', (req, res) => {

    var paginaAtual = req.params.numero ? parseInt(req.params.numero) : 1;
    var offset = 0;
    var itensPorPagina = 2;

    if(isNaN(paginaAtual) || paginaAtual == 1)
        offset = 0;
    else
        offset = (paginaAtual - 1) * itensPorPagina;

    ArtigosModel.findAndCountAll({
        order:[
            ['id','DESC']
        ],
        limit: itensPorPagina,
        offset: offset
    }).then(artigos => {

        console.log(artigos);

        var proxPagina;

        if(offset + itensPorPagina > artigos.count)
            proxPagina = false;
        else
            proxPagina = true;

        var paginacao = {
            atual: paginaAtual,
            proxima: proxPagina,
            artigos: artigos
        }

        //buscar as categorias que são exibidas na navbar
        CategoriasModel.findAll({
            order:[
                ['title', 'ASC']
            ]
        }).then(categorias => {
            res.render('artigos', {categorias: categorias, paginacao: paginacao})
        });

    });

});


app.listen(4000, () => {
    console.log('Servidor rodando na porta 4000!');
});