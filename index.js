const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const connection = require('./database/dadabase');

const categoriasController = require('./categorias/CategoriasController');
const artigosController = require('./artigos/artigosController');

const CategoriasModel = require('./categorias/Categorias');
const ArtigosModel = require('./artigos/Artigos');


app.set('view engine', 'ejs');
app.use(express.static('public'));

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


app.get('/', (req, res) => {
    res.render('index');
});

app.listen(4000, () => {
    console.log('Servidor rodando na porta 4000!');
});