const express = require('express');
const UsuariosModel = require('./Usuarios');
const router = express.Router();
const bcrypt = require('bcryptjs');
const autenticar = require('../middlewares/autenticacao');

//tela de listagem dos usuários
router.get('/admin/usuarios', autenticar, (req, res) => {
    
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
router.get('/admin/usuarios/novo', autenticar, (req, res) => {
    res.render('admin/usuarios/form-cadastro');
});

//cadastro de usuário
router.post('/admin/usuarios/salvar', autenticar, (req, res) => {

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

router.get('/admin/usuarios/editar/:id', autenticar, (req, res) => {

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
router.post('/admin/usuario/editar', autenticar, (req, res) => {

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
router.get('/admin/usuario/excluir/:id', autenticar, (req, res) => {

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

//tela de login
router.get('/login', (req, res) => {
    res.render('admin/usuarios/login');
});

//efetua o login
router.post('/logar', (req, res) => {

    var login = req.body.login;
    var senha = req.body.senha;
    
    if(login.length >= 3 && senha.length >= 3){

        UsuariosModel.findOne({
            where: {
                login: login
            }
        }).then(usuario => {

            if(usuario != undefined){

                //faz a comparação do hash gravado no banco com a senha digitado no form de login
                var verificacao = bcrypt.compareSync(senha, usuario.senha);

                if(verificacao){

                    //cria a session
                    req.session.usuario = {
                        id: usuario.id,
                        login: usuario.login,
                        nome: usuario.nome,
                        email: usuario.email
                    }

                    //res.json(req.session.usuario);
                    res.redirect('/admin');

                }else{
                    res.send('Senha incorreta!');
                }
            
            }else{
                res.send('Usuário não encontrado!');
            }
           
        })

    }else{
        res.send('Login e senha devem ter pelo menos 3 caracteres!');
    }

});

//rota para destruir a session
router.get('/sair', (req, res) => {

    if(req.session.usuario){
       req.session.destroy();
       res.redirect('/login'); 
    }else{
        res.send('Não doi possível efetuar o logout!');
    }

});


module.exports = router;