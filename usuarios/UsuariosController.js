const express = require('express');
const UsuariosModel = require('./Usuarios');
const router = express.Router();
const bcrypt = require('bcryptjs');

//tela de listagem dos usuários
router.get('/admin/usuarios', (req, res) => {
    
    UsuariosModel.findAll({
        order:[
            ['id', 'DESC']
        ]
    }).then(usuarios => {
        res.render('admin/usuarios/index', {
            usuarios: usuarios
        });
    }).catch((error) => {
        res.redirect('/');
    });

});

//tela de cadastro de usuários
router.get('/admin/usuarios/novo', (req, res) => {
    res.render('admin/usuarios/form-cadastro');
});

//cadastro de usuário
router.post('/admin/usuarios/salvar', (req, res) => {

    var nome = req.body.nome;
    var email = req.body.email;
    var login = req.body.login;
    var senha = req.body.senha;

    //verificando se já existe usuario com o login informado
    UsuariosModel.findOne({
        where:{
            login: login
        }
    }).then(usuario => {

        if(usuario == undefined){

            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(senha, salt);

            UsuariosModel.create({
                nome: nome,
                email: email,
                login: login,
                senha: hash
            }).then(() => {
                res.redirect('/admin/usuarios');
            }).catch((error) => {
                res.redirect('/');
            });

        }else{
            res.send('Já existe um usuário com o login: '+login);
        }

    });

});

router.get('/admin/usuarios/editar/:id', (req, res) => {

    var id = req.params.id ? req.params.id : false;
    
    if(id){

        UsuariosModel.findByPk(id).then(usuario => {
            res.render('admin/usuarios/form-edicao', {usuario : usuario});
        }).catch((error) => {
            res.redirect('/');
        });

    }else{
        res.redirect('/');
    }
    
});

//rotina de update de usuário no banco
router.post('/admin/usuario/editar', (req, res) => {

    var id    = req.body.id;
    var nome  = req.body.nome;
    var email = req.body.email;
    var login = req.body.login;
    var senha = req.body.senha;

    //criando o objeto de edição
    var edicao = {
        nome: nome,
        email: email,
        login: login
    }

    //se o usuario digitou uma nova senha, adiciona a variável senha no objeto de edição
    if(senha.length > 0){
        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(senha, salt);

        edicao.senha = hash;
    }

    //res.json(edicao);
    
    UsuariosModel.update(
        edicao,{
        where: {
            id: id
        }
    }).then(() => {
        res.redirect('/admin/usuarios');
    }).catch((error) => {
        res.redirect('/');
    });
    
});

//rotina de exclusão de usuário
router.get('/admin/usuario/excluir/:id', (req, res) => {

    var id = req.params.id ? req.params.id : 0;
    
    if(id){

        UsuariosModel.destroy({
            where:{
                id: id
            }
        }).then(() => {
            res.redirect('/admin/usuarios');
        }).catch((error) => {
            res.send('Erro ao tentar excluir o usuário!');
        });

    }else{
        res.redirect('/');
    }

});

module.exports = router;