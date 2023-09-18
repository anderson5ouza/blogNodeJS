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

module.exports = router;